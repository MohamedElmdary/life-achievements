import { Resolver } from '../resolver.interface';
import { UserCreateInput, User } from '@generated';

const createUser: Resolver<UserCreateInput, User> = async (
  _,
  args,
  { mutation },
  info
) => {
  return await mutation.createUser(args, info);
};

export default { createUser };
