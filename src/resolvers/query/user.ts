import { Resolver } from '../resolver.interface';
import { User } from '@generated';

const searchUsers: Resolver<{ name: string }, User[]> = async (
  _,
  { data: { name } },
  { query, req },
  info
) => {
  return await query.users(
    {
      where: {
        register_code: null,
        id_not: (<any>req).userId,
        OR: [
          {
            first_name_contains: name
          },
          {
            last_name_contains: name
          }
        ]
      }
    },
    info
  );
};

const getUser: Resolver<{ id: string }, User | null> = async (
  _,
  { data: { id } },
  { query, req },
  info
) => {
  return (
    await query.users(
      {
        where: {
          id,
          register_code: null
        }
      },
      info
    )
  )[0];
};

export default { searchUsers, getUser };
