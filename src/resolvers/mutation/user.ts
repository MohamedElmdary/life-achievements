import { Resolver } from '../resolver.interface';
import { UserCreateInput, User } from '@generated';
import { genSaltSync, hashSync } from 'bcryptjs';
import { v1 } from 'uuid';
import { generateToken, isValidToken } from '@utils';
import { sendEmail } from '@config';

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
    const user = await mutation.createUser(args);
    await sendEmail({
        to: user.email,
        subject: 'verify email',
        html: `
        your register code is : ${user.register_code}
      `
    });
    return user;
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
    { req, query, mutation },
    info
) => {
    const { id, token } = (<any>req).user;
    try {
        isValidToken(token);
        return (await query.user({ where: { id } }, info)) as User;
    } catch {
        const token = generateToken(id);
        return (await mutation.updateUser(
            {
                where: {
                    id
                },
                data: {
                    token
                }
            },
            info
        )) as User;
    }
};

const makeFriend: Resolver<{ id: string }, User> = async (
    _,
    { data: { id } },
    { req, mutation },
    info
) => {
    await mutation.updateUser({
        where: {
            id
        },
        data: {
            friends: {
                connect: {
                    id: (<any>req).userId
                }
            }
        }
    });
    return (await mutation.updateUser(
        {
            where: {
                id: (<any>req).userId
            },
            data: {
                friends: {
                    connect: {
                        id
                    }
                }
            }
        },
        info
    )) as User;
};

const unFriend: Resolver<{ id: string }, User> = async (
    _,
    { data: { id } },
    { req, mutation },
    info
) => {
    await mutation.updateUser({
        where: {
            id
        },
        data: {
            friends: {
                disconnect: {
                    id: (<any>req).userId
                }
            }
        }
    });
    return (await mutation.updateUser(
        {
            where: {
                id: (<any>req).userId
            },
            data: {
                friends: {
                    disconnect: {
                        id
                    }
                }
            }
        },
        info
    )) as User;
};

export default { createUser, verifyRegister, loginUser, makeFriend, unFriend };
