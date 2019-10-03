import User from './mutation/user';
import Achievement from './mutation/achievement';

const resolvers = {
  Query: {
    hello: () => 'hello world'
  },
  Mutation: {
    ...User,
    ...Achievement
  }
};

export { resolvers };
