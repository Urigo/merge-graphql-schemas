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

# This part is hard because everything is in unparsed GraphQL language (string):
type Query {
  clients: [Client]
  client(id: ID!): Client
  products: [Product]
  product(id: ID!): Product
}
```

It's the same for our resolvers: Create everything in one big/complex file/object or merge multiple files/objects into one.

This package will allow you to just specify a folder or a set of imports to merge. `mergeGraphqlSchemas()` will merge not only your types but also root queries in the correct format to be passed to `makeExecutableSchema()`. We could also go one step further and actually call `makeExecutableSchema`.

## Options

Our function `mergeGraphqlSchemas` should be able to receive:
  * only a string indicating the folder where all types and resolvers are;
  * an array of objects where the package would extract types and resolvers;
  * an object where the user would have many options to specify folders,
  specific query and mutation type names, and any other options we see fit.

## API Example

Only passing a folder directory:

```js
  const executableSchema = mergeGraphqlSchemas('./graphql');

  app.use(
    '/graphql',
    bodyParser.json(),
    apolloExpress({ schema: executableSchema })
  );
```

Passing an array of type definitions:

```js
  const executableSchema = mergeGraphqlSchemas([ClientType, ProductType, ...]);

  app.use(
    '/graphql',
    bodyParser.json(),
    apolloExpress({ schema: executableSchema })
  );
```

Passing an options object:

```js
  const executableSchema = mergeGraphqlSchemas({
    typesFolder: './graphql/types', // get everything in this folder
    resolversFolder: './graphql/resolvers',
    types: [ClientType, ProductType], // or specify objects you import yourself
    resolvers: [ClientResolvers, ProductResolvers]
    rootQueryName: 'Query',
    rootMutationName: 'Mutation',
    ...
  })

  app.use(
    '/graphql',
    bodyParser.json(),
    apolloExpress({ schema: executableSchema })
  );
```
