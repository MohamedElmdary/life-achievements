import { Middleware } from '../middleware.interface';
import { validateAuth, validate, GqlError } from '@utils';
import { isNumeric } from 'validator';

const searchUsers: Middleware = async (
  resolver,
  _,
  { data: { skip, limit } },
  { req, exists, mutation },
  info
) => {
  const userId = await validateAuth(req, exists, mutation);
  (<any>req).userId = userId;
  return resolver();
};

export default { searchUsers };
