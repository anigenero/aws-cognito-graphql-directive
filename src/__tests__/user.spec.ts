import { Chance } from 'chance';
import { User } from '../user';

// tslint:disable:no-duplicate-string

describe('user', () => {

	const chance = new Chance();

	it('should be anonymous', () => {

		const user = new User();
		expect(user.isAnonymous()).toBe(true);

	});

	it('should not be anonymous', () => {

		const payload = {
			sub: chance.guid(),
			['cognito:groups']: ['admin']
		};

		const user = new User(payload);

		expect(user.isAnonymous()).toBe(false);
		expect(user.getCognitoId()).toBe(payload.sub);
		expect(user.getPayload()).toEqual(payload);

	});

	it('hasGroup should return true', () => {

		const group = 'admin';
		const payload = {
			sub: chance.guid(),
			['cognito:groups']: [group]
		};

		const user = new User(payload);

		expect(user.isAnonymous()).toBe(false);
		expect(user.getCognitoId()).toBe(payload.sub);
		expect(user.hasGroup(group)).toBe(true);

	});

	it('hasGroup should return false', () => {

		const payload = {
			sub: chance.guid(),
			['cognito:groups']: ['admin']
		};

		const user = new User(payload);

		expect(user.isAnonymous()).toBe(false);
		expect(user.getCognitoId()).toBe(payload.sub);
		expect(user.hasGroup('hobbit')).toBe(false);

	});

});
