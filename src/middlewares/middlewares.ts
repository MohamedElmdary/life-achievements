// Mutation
import User from './mutation/user';
import Achievement from './mutation/achievement';
import Comment from './mutation/comment';
import Replay from './mutation/replay';

// Query
import AchievementQuery from './query/achievement';
import UserQuery from './query/user';

const middlewares = [
  {
    Query: {
      ...AchievementQuery,
      ...UserQuery
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
