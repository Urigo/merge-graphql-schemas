import { merge } from 'lodash';

const mergeResolvers = resolvers => merge(...resolvers);

export default mergeResolvers;
