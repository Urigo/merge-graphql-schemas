// Import these two es7 features until we drop Node 4 support
import 'core-js/modules/es7.object.values'; // eslint-disable-line
import 'core-js/modules/es7.array.includes'; // eslint-disable-line

import fileLoader from './file_loader';
import mergeTypes from './merge_types';
import mergeResolvers from './merge_resolvers';

export { mergeResolvers, mergeTypes, fileLoader };
