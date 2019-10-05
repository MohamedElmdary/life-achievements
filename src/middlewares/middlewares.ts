// Mutation
import User from './mutation/user';
import Achievement from './mutation/achievement';
import Comment from './mutation/comment';
import Replay from './mutation/replay';

// Query
import AchievementQuery from './query/achievement';

const middlewares = [
  {
    Query: {
      ...AchievementQuery
    },
    Mutation: {
      ...User,
      ...Achievement,
      ...Comment,
      ...Replay
    }
  }
];

export { middlewares };
