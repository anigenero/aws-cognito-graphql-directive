import { defaultFieldResolver, GraphQLField, GraphQLInterfaceType, GraphQLObjectType } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import { isArray } from 'lodash';
import { AuthenticationError } from './auth.error';
import { User } from './user';

export class AuthDirective extends SchemaDirectiveVisitor {

	public visitFieldDefinition(field: GraphQLField<any, any>, details: { objectType: GraphQLObjectType | GraphQLInterfaceType }):
		GraphQLField<any, any> | void | null {

		const {resolve = defaultFieldResolver} = field;
		const {groups} = this.args;

		field.resolve = async function(...args: any[]) {

			const [, , context] = args;
			const auth: User = context.auth;

			if (!auth.isAnonymous()) {

				if (isArray(groups)) {
					groups.forEach((value: string) => {
						if (!auth.hasGroup(value)) {
							throw new AuthenticationError(`Unauthorized access for group '${value}'`);
						}
					});
				}

				return await resolve.apply(this, args);

			} else {
				throw new AuthenticationError('Unauthorized access');
			}

		};

	}

}