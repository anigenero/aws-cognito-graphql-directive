import { AuthenticationError } from '../auth.error';

describe('auth.error', () => {

	it('should create error with cause', () => {

		const cause = new Error('an error occurred');
		const message = 'An auth error occurred';

		const error = new AuthenticationError(message, cause);

		expect(error.cause).toEqual(cause);
		expect(error.message).toEqual(message);

	});

	it('should create error without cause', () => {

		const message = 'An auth error occurred';

		const error = new AuthenticationError(message);

		expect(error.cause).toBeUndefined();
		expect(error.message).toEqual(message);

	});

});
