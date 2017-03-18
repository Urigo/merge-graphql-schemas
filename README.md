# MergeGraphqlSchemas

## Objectives:
  * Reduce the complexity of Graphql server implementation
  * Modularize type and resolver files

## Motivation

When using graphql-tools, a package from the ApolloStack Team, to combine our
types and resolvers, we call the function `makeExecutableSchema()`, passing the full schema as a string, and a resolvers object.

For the schema file, we can create it as a single string containing all types.
But as the app grows, so does the size/complexity of this file. On the other hand, if we put every type in its own file, we need a way of merging all that information back into one string. Apollo lets us pass multiple strings, which lets us separate types, but the root queries for those types still need to be merged with the root query and mutation objects. We would like to be able to specify a types and queries that belong to the same domain together:

*ClientType*
```
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
```

*ProductType*
```
type Product {
  id: ID!
  description: String
  price: Int
}

type Query {
  products: [Product]
  product(id: ID!): Product
}
```


*Merged Result*
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
```

It's the same for our resolvers: Create everything in one big/complex file/object or merge multiple files/objects into one.

This package will allow you to just specify a folder or a set of imports to merge. `mergeGraphqlSchemas()` will merge not only your types but also root queries in the correct format to be passed to your GraphQL server.

## Usage

There are two ways you can use this package:
  - 1. Passing the path of your GraphQL folder
  - 2. Merging `types` and `resolvers` into separate `index` files

## Passing the path of your GraphQL folder

This is the easiest way of getting started.

```js
  import path from 'path';
  import { mergeGraphqlSchemas } from 'merge-graphql-schemas';
  import { graphqlExpress } from 'graphql-server-express';

  const schema = mergeGraphqlSchemas(path.join(__dirname, './graphql'));

  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
```

For this to work, the package expects that your `/graphql` folder contains `/types` and `/resolvers` folders. Any files you add to those folders will be used to produce the final schema object.

## Merging `types` and `resolvers` into separate `index` files

If you prefer to have more control over what gets merged, the other way you can use this package is by only calling the `mergeTypes()` and `mergeResolvers()` functions.

Take a look at the example below:

```js
  import { mergeTypes } from 'merge-graphql-schemas';
  import clientType from './client_type';
  import productType from './product_type';

  // Passing an array with all types you want merged
  export default mergeTypes([clientType, productType]);
```

And the same idea for your resolvers:
```js
  import { mergeResolvers } from 'merge-graphql-schemas';
  import clientResolver from './client_resolver';
  import productResolver from './product_resolver';

  // Passing an array with all resolvers you want merged
  export default mergeResolvers([clientResolver, productResolver]);
```

Here's an example of how you would implement your server:

```js
  import express from 'express';
  import { makeExecutableSchema } from 'graphql-tools';
  import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

  // Import your types and resolvers
  import resolvers from './graphql/resolvers/index';
  import typeDefs from './graphql/types/index';

  // In this case, you need to call makeExecutableSchema()
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const app = express();
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
```

## Implementing Types

Here's an example of how you should implement your types:

```js
  export default `
    type Client {
      id: ID!
      name: String
      age: Int
      products: [Product]
    }

    type Query {
      clients: [Client]
    }

    type Mutation {
      create_client(name: String!, age: Int!): Client
    }
  `;
```

At this moment, you need to use the `Query` and `Mutation` types.

## Implementing Resolvers

Here's an example of how you should implement your resolvers:

```js
export default {
  Query: {
    clients: () => {}
  },
  Mutation: {
    create_client: (_, args) => {}
  },
  Client: {
    products: () => {},
  },
}
```

## License

MIT licensed

Copyright (C) 2017 OK GROW!, http://www.okgrow.com
