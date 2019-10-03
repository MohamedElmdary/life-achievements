import User from './mutation/user';

const middlewares = [
  {
    Mutation: {
      ...User
    }
  }
];

export { middlewares };
