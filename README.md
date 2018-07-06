# Merge Graphql Schemas

[![Build Status](https://semaphoreci.com/api/v1/okgrow/merge-graphql-schemas/branches/master/shields_badge.svg)](https://semaphoreci.com/okgrow/merge-graphql-schemas)
[![npm version](https://img.shields.io/npm/v/merge-graphql-schemas.svg?style=flat-square)](https://www.npmjs.com/package/merge-graphql-schemas)
[![npm downloads](https://img.shields.io/npm/dm/merge-graphql-schemas.svg?style=flat-square)](https://www.npmjs.com/package/merge-graphql-schemas)

> A utility library to facilitate merging of modularized GraphQL schemas and resolver objects.

This tool:
  * Reduces the complexity of Graphql server implementation.
  * Modularize type and resolver files.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Merging type definitions](#merging-type-definitions)
  - [Manually import each type](#manually-import-each-type)
  - [Import everything from a specified folder](#import-everything-from-a-specified-folder)
  - [Output the string of typeDefs](#output-the-string-of-typedefs)
  - [Merging nested Types](#merging-nested-types)
  - [Merging resolvers](#merging-resolvers)
  - [Server setup](#server-setup)
- [Maintainer](#maintainer)
- [Contributing](#contributing)
- [License](#license)

## Install

```sh
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

If you decide to have manual control of each file that gets merged, all you need is the `mergeTypes(types)` function.

Ability to merge a GQL Type defined multiple times in separate files. Will throw an error when fieldDefintitons have conflicting values defined. See [PR #118](https://github.com/okgrow/merge-graphql-schemas/pull/118) for more details.
```js
// ./graphql/types/index.js
import { mergeTypes } from 'merge-graphql-schemas';
import clientType from './clientType';
import productType from './productType';

const types = [
  clientType,
  productType,
];

// NOTE: 2nd param is optional, and defaults to false
// Only use if you have defined the same type multiple times in
// different files and wish to attempt merging them together.
export default mergeTypes(types, { all: true });
```

### Import everything from a specified folder

In this way we use the `fileLoader` function to import all files from the specified folder.

```js
// ./graphql/typeDefs.js
import path from 'path';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

const typesArray = fileLoader(path.join(__dirname, './types'));

export default mergeTypes(typesArray, { all: true });
```
When using the `fileLoader` function you can also implement your type definitions using `.graphql` or `.graphqls` files.

> The `fileLoader` function will by default ignore files named `index.js` or `index.ts`. This allows you to create your index file inside the actual types folder if desired.

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

You can also load files in nested folders by setting the `recursive` option.

Given the file structure below:

```
+-- graphql
|   +-- types
|   |   +-- subGroupA
|   |   |   +-- typeA1.graphql
|   |   |   +-- typeA2.graphql
|   |   +-- subGroupB
|   |   |   +-- typeB1.graphql
|   |   |   +-- typeB2.graphql
|   |   +-- index.js
```

Here's how your `index` file could look like:

```js
const path = require('path')
const mergeGraphqlSchemas = require('merge-graphql-schemas')
const fileLoader = mergeGraphqlSchemas.fileLoader
const mergeTypes = mergeGraphqlSchemas.mergeTypes

const typesArray = fileLoader(path.join(__dirname, '.'), { recursive: true })

module.exports = mergeTypes(typesArray, { all: true })
```

You can also load files in different folders by passing a glob pattern in `fileLoader`.

Given the file structure below:
```
+-- graphql
|   +-- subGroupA
|   |   +-- typeA1.graphql
|   |   +-- typeA2.graphql
|   +-- subGroupB
|   |   +-- typeB1.graphql
|   |   +-- typeB2.graphql
|   +-- index.js
```

Here's how your `index` file could look like:

```js
const path = require('path')
const mergeGraphqlSchemas = require('merge-graphql-schemas')
const fileLoader = mergeGraphqlSchemas.fileLoader
const mergeTypes = mergeGraphqlSchemas.mergeTypes

const typesArray = fileLoader(path.join(__dirname, 'graphql/**/*.graphql'))

module.exports = mergeTypes(typesArray, { all: true })
```

### Output the string of typeDefs

Since the output of `mergeTypes` is just a string, after you merge your types, you can save it to a file to be passed around to other systems. Here is an example using ES6 modules:

```js
import { fileLoader, mergeTypes } from 'merge-graphql-schemas'
import { writeFileSync } from 'fs'

const typeDefs = mergeTypes(fileLoader(`${__dirname}/schema/**/*.graphql`), { all: true })
writeFileSync('joined.graphql', typeDefs)
```

### Merging nested Types

The `mergeTypes` function also allows merging multiple schemas. In the situations where you would like to have multiple
types subfolders, you can merge your types on each subfolder and then everything into one single schema. See the example below:

```
+-- graphql
|   +-- types
|   |   +-- subGroupA
|   |   |   +-- index.js <<< Merges all types in subGroupA
|   |   |   +-- typeA1.graphql
|   |   |   +-- typeA2.graphql
|   |   +-- subGroupB
|   |   |   +-- index.js <<< Merges all types in subGroupB
|   |   |   +-- typeB1.graphql
|   |   |   +-- typeB2.graphql
|   |   +-- index.js <<< Merges exports from subGroupA and subGroupB
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

#### Merging Directives

Directives will be stacked on top of each other, in the order of declaration.

```js
type Query {
  client: Client @foo
}
type Query {
  client: Client @bar
}
```

Becomes

```
type Query {
  client: Client @foo @bar
}
```

#### Warning

If you are using `graphqlHTTP` you don't need to separate the resolver into `Query/Mutation/Subscription`, otherwise it won't work. The resolvers should look like the following:


```js
// ./graphql/resolvers/clientResolver.js
export default {
  // Query
  clients: () => {},
  client: () => {},

  // Mutation
  addClient: () => {},

  Product: {
    products: () => {},
  },
}

// ./graphql/resolvers/productResolver.js
export default {
  // Query
  products: () => {},
  product: () => {},

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

> Beware that `mergeResolvers` is simply merging plain Javascript objects together.
This means that you should be careful with Queries, Mutations or Subscriptions with naming conflicts.

You can also load files with specified extensions by setting the extensions option.  
Only these values are supported now. `'.ts', '.js', '.gql', '.graphql', '.graphqls'`
```js
// ./graphql/resolvers.js
import path from 'path';
import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';

const resolversArray = fileLoader(path.join(__dirname, './resolvers'), { extensions: ['.js'] });

export default mergeResolvers(resolversArray);
```

**Optional: Automatic with Resolver Naming Convention**

If you would like to use the automated `fileLoader` approach _but_ would like complete 
freedom over the structure of your resolver files, then simply use a resolver file naming 
convention like, `[file].resolvers.js/ts`. 

Then setup your `fileLoader` like so, and you're in business:

```js
// ./graphql/resolvers/index.js/ts
import path from 'path';
import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';

const resolversArray = fileLoader(path.join(__dirname, "./**/*.resolvers.*"));
export default mergeResolvers(resolversArray);
```
With this approach, you're free to structure resolver files as you see fit. Of course,
unique naming of Queries, Mutations and Subscriptions still applies! 

Now you can structure by **function**...
```
+-- graphql
|   +-- resolvers
|   |   +-- author.resolvers.js/ts
|   |   +-- book.resolvers.js/ts
|   |   +-- index.ts  <<< Merges all `*.resolvers.*` files
```

Or by **type**...
```
+-- graphql
|   +-- entity
|   |   +-- author
|   |   |   +-- author.resolvers.js/ts
|   |   |   +-- ...
|   |   +-- book
|   |   |   +-- book.resolvers.js/ts
|   |   |   +-- ...
|   |   +-- index.ts <<< Merges all `*.resolvers.*` files
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

## Maintainers

This is an open source package. We hope to deal with contributions in a timely manner, but that's not always the case. The main maintainers are:

[@RodMachado](https://github.com/RodMachado)

[@cfnelson](https://github.com/cfnelson)

[@RichardLitt](https://github.com/RichardLitt) (triage and basic support)

Along with the team at [@okgrow](https://github.com/okgrow).

Feel free to ping if there are open issues or pull requests which are taking a while to be dealt with!

## Contributing

Issues and Pull Requests are always welcome.

Please read OK Grow's global [contribution guidelines](https://github.com/okgrow/guides/blob/master/docs/OpenSource-Contributing.md).

If you are interested in becoming a maintainer, get in touch with us by sending an email or opening an issue. You should already have code merged into the project. Active contributors are encouraged to get in touch.

Please note that all interactions in @okgrow's repos should follow our [Code of Conduct](https://github.com/okgrow/guides/blob/master/docs/OpenSource-CodeOfConduct.md).

## License

[MIT](LICENSE) © 2017 OK GROW!, https://www.okgrow.com.
