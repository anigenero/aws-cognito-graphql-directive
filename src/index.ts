import gql from 'graphql-tag';

export { AuthDirective } from './auth.directive';
export { AuthenticationError } from './auth.error';
export { IAuthConfig, getAuthContext } from './auth';
export { User } from './user';

export const authTypeDefs = gql(require('./auth.graphql'));
