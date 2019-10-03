import { importSchema } from 'graphql-import';
const { transpileSchema } = require('graphql-s2s').graphqls2s;

/**
 *  @Note
 *  some temp solution is to replace implements with inherits
 */

const typeDefs = transpileSchema(
  importSchema('src/graphql/schema.graphql').replace(/implements/g, 'inherits')
);

export { typeDefs };
