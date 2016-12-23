# MergeGraphqlSchemas

## Objectives:
  * Reduce the complexity of Graphql server implementation
  * Facilitate the modularization of type and resolver files

## Motivation

When using graphql-tools, a package from the ApolloStack Team, to combine our
types and resolvers, we call the function `makeExecutableSchema` passing the full
schema as a string, and a resolvers object.

For the schema file, we can create it as a single string containing all types
but as the app grows so does the size/complexity of this file. The other way,
if we put every type in its own file, we would need a way of merging all that
information back in one string.

Samething for our resolvers, create everything in one big/complex file/object or
merge multiple files/objects into one.

This package will help the user by giving him a function where he can pass in
the folder(s) that contain the types and resolvers and will return everything
ready to be passed to `makeExecutableSchema`. We could also go one step ahead
and return an actual executableSchema, in other words, the package would call
`makeExecutableSchema`.

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

Passing an array of objects:

```js
  const executableSchema = mergeGraphqlSchemas([ClientType, ProductType, ...]);

  app.use(
    '/graphql',
    bodyParser.json(),
    apolloExpress({ schema: executableSchema })
  );
```

Passing a complex object:

```js
  const executableSchema = mergeGraphqlSchemas({
    typesFolder: './graphql/types',
    resolversFolder: './graphql/resolvers',
    queryTypeName: 'rootQuery',
    mutationTypeName: 'rootMutation',
    ...
  })

  app.use(
    '/graphql',
    bodyParser.json(),
    apolloExpress({ schema: executableSchema })
  );
```
