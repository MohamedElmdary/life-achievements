import './configs/setup';
import 'module-alias/register';
import { prisma, options } from '@config';
import { GraphQLServer } from 'graphql-yoga';

const server = new GraphQLServer({
  context({ request }) {
    return {
      req: request,
      prisma
    };
  },
  typeDefs: `
        type Query {
            hello: String!
        }
    `,
  resolvers: {
    Query: {
      hello: () => 'hello world'
    }
  }
});

server.start(options, () => console.log('server started!'));
