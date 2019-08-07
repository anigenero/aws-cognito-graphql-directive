export class User {

	private readonly _anonymous: boolean;

	private _cognitoId: string;
	private _groups: Set<string>;
	private _payload: any;
	private _username: string;

	constructor(username?: string, payload?: any) {

		if (username) {

			this._anonymous = false;
			this._cognitoId = payload.sub;
			this._groups = new Set(payload['cognito:groups']);
			this._username = username;

		} else {
			this._anonymous = true;
		}

	}

	public getCognitoId(): string {
		return this._cognitoId;
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
