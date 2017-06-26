[![Build Status](https://semaphoreci.com/api/v1/okgrow/merge-graphql-schemas/branches/master/shields_badge.svg)](https://semaphoreci.com/okgrow/merge-graphql-schemas)
[![npm version](https://img.shields.io/npm/v/merge-graphql-schemas.svg?style=flat-square)](https://www.npmjs.com/package/merge-graphql-schemas)
[![npm downloads](https://img.shields.io/npm/dm/merge-graphql-schemas.svg?style=flat-square)](https://www.npmjs.com/package/merge-graphql-schemas)

# MergeGraphqlSchemas

## Objectives:
  * Reduce the complexity of Graphql server implementation
  * Modularize type and resolver files

## Usage

### Merging type definitions

Let's say this is your current schema:

```
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

```
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

module.exports = mergeTypes(types);
```

### Import everything from a specified folder

In this way we use the `fileLoader` function to import all files from the specified folder.

```js
// ./graphql/typeDefs.js
import path from 'path';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

const typesArray = fileLoader(path.join(__dirname, './types'));

module.exports = mergeTypes(typesArray);
```

### Merging resolvers

Resolvers should be implemented as simple JS objects. Following our example, for the types we implemented
our resolvers should like like the following:


```js
// ./graphql/resolvers/clientResolver.js
export default {
  Query: {
    clients: () => {}
    client: () => {}
  },
  Mutation: {
    addClient: () => {}
  },
  Client: {
    products: () => {},
  },
}

// ./graphql/resolvers/productResolver.js
export default {
  Query: {
    products: () => {}
    product: () => {}
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

module.exports = mergeResolvers(resolvers);
```
Or automatically:

```js
// ./graphql/resolvers.js
import path from 'path';
import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';

const resolversArray = fileLoader(path.join(__dirname, './resolvers'));

module.exports = mergeResolvers(resolversArray);
```

### Server setup

Here's an example using express-graphql:

```js
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const typeDefs = require('./graphql/types/index')
const schema = buildSchema(typeDefs);
const rootValue = require('./graphql/resolvers/index');

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
const express = require('express');
const apolloExpress = require('apollo-server').apolloExpress;
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const graphiqlExpress = require('apollo-server').graphiqlExpress;
const bodyParser = require('body-parser');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const schema = makeExecutableSchema({typeDefs, resolvers});

app.use(
  '/graphql',
  bodyParser.json(),
  apolloExpress({ schema })
);
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

app.listen(3000);
module.exports = app;
```

## License

MIT licensed

Copyright (C) 2017 OK GROW!, https://www.okgrow.com
