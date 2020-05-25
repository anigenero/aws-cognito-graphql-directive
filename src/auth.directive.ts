import {defaultFieldResolver, GraphQLField} from 'graphql';
import {isArray} from 'lodash';
import {AuthenticationError} from './auth.error';
import {User} from './user';
import {SchemaDirectiveVisitor} from '@graphql-tools/utils';

export type AuthContext = { auth: User };
export type DirectiveArgs = {
    anonymous: boolean;
    groups: string[];
};

export class AuthDirective<C extends AuthContext = AuthContext> extends SchemaDirectiveVisitor {

    public visitFieldDefinition(
        _field: GraphQLField<any, AuthContext, DirectiveArgs>
    ): GraphQLField<any, any> | void | null {

        const {resolve = defaultFieldResolver} = _field;
        const {groups} = this.args;

        _field.resolve = function (...args: [any, any, AuthContext]): Promise<any> {

            const [, , {auth}] = args;
            if (!auth.isAnonymous()) {

                if (isArray(groups)) {
                    groups.forEach((value: string) => {
                        if (!auth.hasGroup(value)) {
                            throw new AuthenticationError(`Unauthorized access for group '${value}'`);
                        }
                    });
                }

                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return resolve.apply(this, args);

            } else {
                throw new AuthenticationError('Unauthorized access');
            }

        };

    }

}
