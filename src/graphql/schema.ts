import User from './user';
import Achievement from './achievement';

const typeDefs = `
  ${User}
  ${Achievement}

  type Query {
    hello: String!
  }

  type Mutation {
    createUser(data: CreateUserInput!): PublicUser!
    createAchievement(data: CreateAchievementInput!): PublicAchievement!
  }
`;

export { typeDefs };
