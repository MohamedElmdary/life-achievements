import './configs/setup';
import 'module-alias/register';
import { prisma, options } from '@config';
import { GraphQLServer } from 'graphql-yoga';
import { typeDefs } from '@graphql';
import { middlewares } from '@middlewares';
import { resolvers } from '@resolvers';

const server = new GraphQLServer({
    context({ request }) {
        return {
            req: request,
            query: prisma.query,
            mutation: prisma.mutation,
            subscription: prisma.subscription,
            exists: prisma.exists
        };
    },
    typeDefs,
    middlewares,
    resolvers
});

server.start(options, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
