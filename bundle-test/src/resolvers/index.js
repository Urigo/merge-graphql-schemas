import { mergeResolvers } from 'merge-graphql-schemas';
import clientResolver from './clientResolver';
import productResolver from './productResolver';

const resolvers = [
    clientResolver,
    productResolver,
];

export default mergeResolvers(resolvers);