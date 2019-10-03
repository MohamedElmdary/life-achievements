import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  debug: !!process.env.DEVELOPMENT,
  secret: process.env.PRISMA_SECRET,
  typeDefs: 'generated/schema.prisma.graphql',
  endpoint: 'http://localhost:4466/'
});

export { prisma };
