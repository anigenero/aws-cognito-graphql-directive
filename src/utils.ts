import {ContextFunction} from 'apollo-server-core';
import {ValueOrPromise} from 'apollo-server-types';
import {APIGatewayEvent} from 'aws-lambda';
import {AuthConfig, getAuthContext} from './auth';
import {AuthContext} from './auth.directive';

export const generateLambdaContextFromAPIGateway =
    <Context extends AuthContext>(
        configuration: AuthConfig,
        context?: ValueOrPromise<Context>
    ): ContextFunction<{ event: APIGatewayEvent }, Context> =>
        async ({event: {headers}}): Promise<Context> => ({
            ...(await context || {} as Context),
            auth: await getAuthContext(headers, configuration)
        });
