import {getLogger} from '@log4js2/core';
import jwt from 'jsonwebtoken';
import {GetPublicKeyOrSecret, Secret} from 'jsonwebtoken';
import {isEmpty} from 'lodash';
import fetch from 'node-fetch';
import {DecodedPayload, User} from './user';
import jwkToPem, {RSA} from 'jwk-to-pem';

const _log = getLogger('');

export type AuthConfig = {
    awsRegion: string;
    userPoolId: string;
};

type Headers = {
    [name: string]: string
};

type Payload = {
    header: {
        kid: string;
    };
    payload: {
        iss: string;
        // eslint-disable-next-line camelcase
        token_use: 'access' | 'id';
    };
};

type PemMap = { [key: string]: Secret | GetPublicKeyOrSecret };

/**
 * Validates the token sent in the request
 *
 * @private
 *
 * @param {string} issuer
 * @param {string} token
 * @param {object} pems
 */
const _validateToken = async (issuer: string, token: string, pems: PemMap): Promise<User> => {

    // decode the JWT token
    const decodedJwt = jwt.decode(token, {complete: true}) as Payload;
    if (!decodedJwt) {
        throw new Error('requested token is invalid');
    } else if (decodedJwt.payload.iss !== issuer) { // verify the issuer matches
        throw new Error('invalid issuer on token');
    } else if (decodedJwt.payload.token_use !== 'access') { // ensure the token use is access
        throw new Error('claim is not access token');
    }

    // get the kid from the token and retrieve corresponding PEM
    const {kid} = decodedJwt.header;
    const pem = pems[kid];
    if (!pem) {
        throw new Error('claim made for unknown kid')
    }

    // verify the JWT token
    return new Promise<User>((resolve, reject) =>
        jwt.verify(token, pems[decodedJwt.header.kid], {issuer}, (err, decoded: DecodedPayload) => {
            if (err) {
                _log.debug('unauthorized user:', err.message);
                reject(err);
            } else {
                resolve(new User(decoded));
            }
        })
    );

};

/**
 * Gets the user from the raw authorization token
 *
 * @private
 *
 * @param {string} rawToken
 * @param {string} issuer
 */
const _getUserFromToken = async (rawToken: string, issuer: string): Promise<User> => {

    // Remove 'bearer ' from token:
    const token = rawToken.substring('bearer'.length + 1);

    try {

        const result = await fetch(`${issuer}/.well-known/jwks.json`);
        if (!result.ok) {
            throw new Error('result error for issuer jwks.json');
        }

        const body = (await result.json()) as {
            keys: [RSA & { kid: string }]
        };

        const pems: PemMap = {};
        const keys = body.keys;
        for (let i = 0; i < keys.length; i++) {
            pems[keys[i].kid] = jwkToPem(keys[i]);
        }

        return _validateToken(issuer, token, pems);

    } catch (e) {

        _log.error('jwk verification request error:', e);
        throw e;

    }

};

/**
 * Produces the authorization context for the given user request
 *
 * @param {Headers} headers
 * @param {string} awsRegion
 * @param {string} userPoolId
 */
export const getAuthContext = async (headers: Headers, {awsRegion, userPoolId}: AuthConfig): Promise<User> => {

    const issuer = `https://cognito-idp.${awsRegion}.amazonaws.com/${userPoolId}`;
    if (!isEmpty(headers.Authorization)) {

        const user = _getUserFromToken(headers.Authorization, issuer);
        return (user === null) ? User.fromIdentity(headers['x-cognito-identity-id']) : user;

    }

    // return anonymous user
    return User.fromIdentity(headers['x-cognito-identity-id']);

};
