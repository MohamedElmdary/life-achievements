import User from './mutation/user';
import Achievement from './mutation/achievement';

const middlewares = [
  {
    Mutation: {
      ...User,
      ...Achievement
    }
  }
];

export { middlewares };
