import gql from 'graphql-tag';

export { AuthDirective } from './auth.directive';
export { AuthenticationError } from './auth.error';
export { IAuthConfig, getAuthContext } from './auth';
export { User } from './user';

export const authTypeDefs = gql`
    directive @auth(
        groups: [String]
    ) on FIELD_DEFINITION
`;
