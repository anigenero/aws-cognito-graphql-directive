export class AuthenticationError {

	public cause: Error;
	public message: string;

	constructor(message: string, error?: Error) {

		this.message = message;
		if (error) {
			this.cause = error;
		}

	}

}
