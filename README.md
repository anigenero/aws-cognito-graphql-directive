# aws-cognito-graphql-directive
Directive to check authentication against AWS cognito

## Installation

```bash
> npm install
```

## Setup

```typescript
import { AuthDirective, authTypeDefs, getAuthContext } from 'aws-cognito-graphql-drective';

const generateContext: ContextFunction<any, MyGraphQLContext> =
	async ({event, context}): Promise<MyGraphQLContext> => ({
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
