[![Build Status](https://semaphoreci.com/api/v1/okgrow/merge-graphql-schemas/branches/master/shields_badge.svg)](https://semaphoreci.com/okgrow/merge-graphql-schemas)
[![npm version](https://img.shields.io/npm/v/merge-graphql-schemas.svg?style=flat-square)](https://www.npmjs.com/package/merge-graphql-schemas)
[![npm downloads](https://img.shields.io/npm/dm/merge-graphql-schemas.svg?style=flat-square)](https://www.npmjs.com/package/merge-graphql-schemas)

# Merge Graphql Schemas

An utility library to facilitate merging of modularized GraphQL schemas and resolver objects.


## Objectives:
  * Reduce the complexity of Graphql server implementation
  * Modularize type and resolver files

## Installation

```
npm install -S merge-graphql-schemas
```

## Usage

### Merging type definitions

Let's say this is your current schema:

```graphql
type Client {
  id: ID!
  name: String
  age: Int
  products: [Product]
}

type Product {
  id: ID!
  description: String
  price: Int
}

type Query {
  clients: [Client]
  client(id: ID!): Client
  products: [Product]
  product(id: ID!): Product
}

type Mutation {
  addClient(name: String!, age: Int!): Client
}
```

Knowing that your app will grow, you want to move your definitions to separate files that should look like the following.

```js
// ./graphql/types/clientType.js
export default `
  type Client {
    id: ID!
    name: String
    age: Int
    products: [Product]
  }

  type Query {
    clients: [Client]
    client(id: ID!): Client
  }

  type Mutation {
    addClient(name: String!, age: Int!): Client
  }
`;

// ./graphql/types/productType.js
export default `
  type Product {
    id: ID!
    description: String
    price: Int
    client: Client
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }
`;
```

There are two ways you can use this package:
  * manually import each type
  * import everything from a specified folder

### Manually import each type

If you decide to have manual control of each file that gets merged, all you need is the `mergeTypes` function:

```js
// ./graphql/types/index.js
import { mergeTypes } from 'merge-graphql-schemas';
import clientType from './clientType';
import productType from './productType';

const types = [
  clientType,
  productType,
];

export default mergeTypes(types);
```

### Import everything from a specified folder

In this way we use the `fileLoader` function to import all files from the specified folder.

```js
// ./graphql/typeDefs.js
import path from 'path';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

const typesArray = fileLoader(path.join(__dirname, './types'));

export default mergeTypes(typesArray);
```
When using the `fileLoader` function you can also implement your type definitions using `.graphql` or `.graphqls` files.

```graphql
# ./graphql/types/clientType.graphql
type Client {
  id: ID!
  name: String
  age: Int
  products: [Product]
}

type Query {
  clients: [Client]
  client(id: ID!): Client
}

type Mutation {
  addClient(name: String!, age: Int!): Client
}

# ./graphql/types/productType.graphql
type Product {
  id: ID!
  description: String
  price: Int
  client: Client
}

type Query {
  products: [Product]
  product(id: ID!): Product
}
```

### Merging resolvers

Resolvers should be implemented as simple JS objects. Following our example, for the types we implemented
our resolvers should look like the following:


```js
// ./graphql/resolvers/clientResolver.js
export default {
  Query: {
    clients: () => {},
    client: () => {},
  },
  Mutation: {
    addClient: () => {},
  },
  Client: {
    products: () => {},
  },
}

// ./graphql/resolvers/productResolver.js
export default {
  Query: {
    products: () => {},
    product: () => {},
  },
  Product: {
    client: () => {},
  },
}
```

Just like your type definitions, you can choose to import files manually:

```js
// ./graphql/resolvers/index.js
import { mergeResolvers } from 'merge-graphql-schemas';
import clientResolver from './clientResolver';
import productResolver from './productResolver';

const resolvers = [
  clientResolver,
  productResolver,
];

export default mergeResolvers(resolvers);
```
Or automatically:

```js
// ./graphql/resolvers.js
import path from 'path';
import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';

const resolversArray = fileLoader(path.join(__dirname, './resolvers'));

export default mergeResolvers(resolversArray);
```

### Server setup

Here's an example using express-graphql:

```js
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';

import typeDefs from './graphql/types/index';
import rootValue from './graphql/resolvers/index';

const schema = buildSchema(typeDefs);

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true,
}));

app.listen(3000);
```

Or using apollo-server:

```js
import express from 'express';
import { apolloExpress } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';
import { graphiqlExpress } from 'apollo-server';
import bodyParser from 'body-parser';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

app.use(
  '/graphql',
  bodyParser.json(),
  apolloExpress({ schema })
);
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(3000);
```

## Contributing
Issues and Pull Requests are always welcome.
Please read our [contribution guidelines](https://github.com/okgrow/guides/blob/master/open-source/contributing.md).

## License

MIT licensed

Copyright (C) 2017 OK GROW!, https://www.okgrow.com
