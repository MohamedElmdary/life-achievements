import User from './mutation/user';

const resolvers = {
  Mutation: {
    ...User
  }
};

export { resolvers };
