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
    verifyRegister(data: verifyRegisterInput!): PublicUser!
    loginUser(data: loginUserInput!): CurrentUserType!
    createAchievement(data: CreateAchievementInput!): PublicAchievement!
  }
`;

export { typeDefs };
