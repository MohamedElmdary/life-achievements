import User from './mutation/user';
import Achievement from './mutation/achievement';
import Comment from './mutation/comment';
import Replay from './mutation/replay';

const resolvers = {
  Query: {
    hello: () => 'hello world'
  },
  Mutation: {
    ...User,
    ...Achievement,
    ...Comment,
    ...Replay
  }
};

export { resolvers };
