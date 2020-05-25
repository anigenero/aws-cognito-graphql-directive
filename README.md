# aws-cognito-graphql-directive

[![Build Status](https://travis-ci.org/anigenero/aws-cognito-graphql-directive.svg?branch=master)](https://travis-ci.org/anigenero/aws-cognito-graphql-directive)
[![codecov](https://codecov.io/gh/anigenero/aws-cognito-graphql-directive/branch/master/graph/badge.svg)](https://codecov.io/gh/anigenero/aws-cognito-graphql-directive)

Directive to check authentication against AWS cognito

## Installation

```bash
> npm install
```

## Setup

### Configuration


### Using the Context Function

```typescript
import { AuthDirective, authTypeDefs, getAuthContext } from 'aws-cognito-graphql-drective';
import { merge } from 'lodash';

export const handler = new ApolloServer({
	context: async ({headers}) => ({ 
            auth: await getAuthContext(headers, configuration) 
        }),
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

    anonymousQuery: MyResult
    authRequiredQuery: MyResult @auth
    adminGroupOnlyQuery: MyResult @auth(groups: ["admin"])

}
```

## Utilities

This library includes utilities for easy, quick setup in common environments.

#### Apollo Lambda w/ APIGateway

```typescript
import {generateLambdaContextFromAPIGateway} from 'aws-cognito-graphql-directive';

new ApolloServer({
    context: generateLambdaContextFromAPIGateway(configuration, {
        // ... other context
    })
})
```
