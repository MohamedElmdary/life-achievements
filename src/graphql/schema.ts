import User from './user';

const typeDefs = `
  ${User}

  type Query {
    hello: String!
  }

  type Mutation {
    createUser(data: CreateUserInput!): PublicUser!
  }
`;

export { typeDefs };
