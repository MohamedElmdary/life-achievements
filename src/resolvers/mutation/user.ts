import { Resolver } from '../resolver.interface';
import { UserCreateInput, User } from '@generated';
import { genSaltSync, hashSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { v1 } from 'uuid';

const createUser: Resolver<UserCreateInput, User> = async (
  _,
  args,
  { mutation },
  info
) => {
  const salt = genSaltSync(12);
  const encryptedPassword = hashSync(args.data.password, salt);
  args.data.password = encryptedPassword;
  args.data.register_code = v1();
  return await mutation.createUser(args, info);
};

const verifyRegister: Resolver<UserCreateInput, User> = async (
  _,
  args,
  { req, mutation },
  info
) => {
  const data: any = (<any>req).user;
  return (await mutation.updateUser(
    {
      where: data,
      data: {
        register_code: null
      }
    },
    info
  )) as User;
};

const loginUser: Resolver<UserCreateInput, User> = async (
  _,
  args,
  { req, mutation },
  info
) => {
  const { id } = (<any>req).user;
  const token = sign(
    {
      date: new Date(),
      id
    },
    process.env.JWT_TOKEN_SECRET as string,
    {
      expiresIn: '4h'
    }
  );
  const refresh_token = sign(
    {
      date: new Date().getTime() + 5,
      id
    },
    process.env.JWT_REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: '10d'
    }
  );
  return (await mutation.updateUser(
    {
      where: {
        id
      },
      data: {
        token,
        refresh_token
      }
    },
    info
  )) as User;
};

export default { createUser, verifyRegister, loginUser };
