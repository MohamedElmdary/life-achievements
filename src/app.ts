import './configs/setup';
import 'module-alias/register';
import { prisma, options } from '@config';
import { GraphQLServer } from 'graphql-yoga';
import { typeDefs } from '@graphql';
import { middlewares } from '@middlewares';
import { resolvers } from '@resolvers';

// import { Query } from '@generated';

//@ts-ignore
// const q: Query = prisma.query;

// q.user({where: {email: 'asdsa@asdas.com'}}, '{ friends { achivements { id } } }')
// q.achievements({
//   skip: 10,
//   orderBy: 'created_at_DESC',
//   first: 10,
//   where: {
//     author: {
//       id: 'id',
//       friends_some: {
//         achievements_some: {
//           published: true
//         }
//       }
//     }
//   }
// });

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
