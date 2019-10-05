import User from './mutation/user';
import Achievement from './mutation/achievement';
import Comment from './mutation/comment';
import Replay from './mutation/replay';

const middlewares = [
  {
    Mutation: {
      ...User,
      ...Achievement,
      ...Comment,
      ...Replay
    }
  }
];

export { middlewares };
