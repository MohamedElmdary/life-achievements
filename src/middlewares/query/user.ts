import { Middleware } from '../middleware.interface';
import { validateAuth } from '@utils';

const searchUsers: Middleware = async (
  resolver,
  _,
  __,
  { req, exists, mutation }
) => {
  const userId = await validateAuth(req, exists, mutation);
  (<any>req).userId = userId;
  return resolver();
};

export default { searchUsers, getUser: searchUsers };
