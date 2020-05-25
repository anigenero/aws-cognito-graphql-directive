import gql from 'graphql-tag';

export {AuthDirective} from './auth.directive';
export {AuthenticationError} from './auth.error';
export {AuthConfig, getAuthContext} from './auth';
export {User} from './user';

export const authTypeDefs = gql`
    directive @auth(
        anonymous: Boolean = false,
        groups: [String]
    ) on OBJECT | FIELD_DEFINITION
`;
