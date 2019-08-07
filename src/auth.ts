import { getLogger } from '@log4js2/core';
import * as jwt from 'jsonwebtoken';
import { isEmpty } from 'lodash';
import fetch from 'node-fetch';
import { User } from './user';

/**
 * Gets the authentication context for the specified user
 *
 * @private
 * @param {APIGatewayEvent} event
 */

const jwkToPem = require('jwk-to-pem');

const _log = getLogger('');

export interface IAuthConfig {

	awsRegion: string;
	userPoolId: string;

}

export const getAuthContext = async (headers: { [name: string]: string }, {awsRegion, userPoolId}: IAuthConfig): Promise<User> => {

	const _issuer = `https://cognito-idp.${awsRegion}.amazonaws.com/${userPoolId}`;

	/**
	 * Validates the token sent in the request
	 *
	 * @private
	 *
	 * @param {string} token
	 * @param {object} pems
	 */
	const _validateToken = async (token: string, pems: any): Promise<User> => {

		// decode the JWT token
		const decodedJwt: any = jwt.decode(token, {complete: true});
		if (!decodedJwt) {

			_log.warn('Not a valid JWT token');
			return new User();

		} else if (decodedJwt.payload.iss !== _issuer) { // verify the issuer matches

			_log.warn('Invalid issuer');
			return new User();

		} else if (decodedJwt.payload.token_use !== 'access') { // ensure the token use is access

			_log.warn('Not an access token');
			return new User();

		}

		// get the kid from the token and retrieve corresponding PEM
		const kid = decodedJwt.header.kid;
		const pem = pems[kid];
		if (!pem) {
			_log.warn('Invalid access token');
			return new User();
		}

		// verify the JWT token
		return new Promise<User>((resolve, reject) =>
			jwt.verify(token, pems[decodedJwt.header.kid], {issuer: _issuer}, (err, decoded: any) => {
				if (err) {
					_log.debug('Unauthorized user:', err.message);
					reject(err);
				} else {
					resolve(new User(decoded.username, decoded));
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
	 */
	const _getUserFromToken = async (rawToken: string): Promise<User> => {

		// Remove 'bearer ' from token:
		const token = rawToken.substring('bearer'.length + 1);

		try {

			const result = await fetch(`${_issuer}/.well-known/jwks.json`);

			if (!result.ok) {
				throw new Error('Response not ok');
			}

			const body = await result.json();

			const pems: any = {};
			const keys = body.keys;
			// tslint:disable-next-line:prefer-for-of
			for (let i = 0; i < keys.length; i++) {
				const KEY_ID = keys[i].kid;
				pems[KEY_ID] = jwkToPem({
					kty: keys[i].kty,
					n: keys[i].n,
					e: keys[i].e
				});
			}

			return await _validateToken(token, pems);

		} catch (e) {

			_log.warn('jwk verification request error:', e);
			throw e;

		}

	};

	return await (async (): Promise<User> => {

		if (headers.hasOwnProperty('Authorization')) {

			const {Authorization} = headers;
			if (!isEmpty(Authorization)) {
				try {
					return await _getUserFromToken(Authorization);
				} catch (e) {
					_log.error('There was an error while determining the auth context', e);
				}
			}

		}

		// return anonymous user
		return new User();

	})();

};
