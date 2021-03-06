export type DecodedPayload = {
    sub: string;
    ['cognito:groups']: string[];
};

export class User {

    public static fromIdentity(identityId: string): User {
        return new User(null, identityId);
    }

    private readonly _anonymous: boolean;
    private readonly _cognitoId: string;

    private _groups: Set<string>;

    constructor(private _payload?: DecodedPayload, private _identityId?: string) {

        if (_payload) {

            this._anonymous = false;
            this._cognitoId = _payload.sub;
            this._groups = new Set(_payload['cognito:groups']);

        } else {
            this._anonymous = true;
        }

    }

    public getCognitoId(): string {
        return this._cognitoId;
    }

    public getIdentityId(): string {
        return this._identityId;
    }

    public getPayload(): any {
        return this._payload;
    }

    public hasGroup(group: string): boolean {
        return this._groups.has(group);
    }

    public isAnonymous(): boolean {
        return this._anonymous;
    }

}
