import User from './mutation/user';
import Achievement from './mutation/achievement';

const resolvers = {
  Mutation: {
    ...User,
    ...Achievement
  }
};

export { resolvers };
