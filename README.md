# aws-cognito-graphql-directive
Directive to check authentication against AWS cognito

## Installation

```bash
> npm install
```

## Setup

```typescript
import { AuthDirective, authTypeDefs, getAuthContext } from 'aws-cognito-graphql-drective';

const generateContext: ContextFunction<{event: APIGatewayEvent}, MyGraphQLContext> =
	async ({event}) => ({
		auth: await getAuthContext(event, {
                awsRegion: '',
                userPoolId: ''		
            })
    });

export const handler = new ApolloServer({
	context: generateContext,
	typeDefs: merge(authTypeDefs, myTypeDefs),
	// ..
	schemaDirectives: {
		auth: AuthDirective
	}
}).createHandler();
```

#### Requiring authentication
```graphql
type Query {

    authRequiredQuery: MyResult @auth
    adminGroupOnlyQuery: MyResult @auth(groups: ["admin"])

}
```
