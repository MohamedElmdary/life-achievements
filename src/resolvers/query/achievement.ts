import { Resolver } from '../resolver.interface';
import { Achievement } from '@generated';

const feed: Resolver<{ limit: number; skip: number }, Achievement[]> = async (
  _,
  { data: { skip, limit } },
  { req, query },
  info
) => {
  const { userId } = <any>req;
  console.log(
    'test',
    await query.achievements({
      where: {
        author: {
          friends_some: {
            id: userId
          }
        }
      }
    })
  );
  return await query.achievements(
    {
      orderBy: 'created_at_ASC',
      skip,
      first: limit,
      where: {
        author: {
          friends_some: {
            id: userId
          }
        },
        published: true
      }
    },
    info
  );
};
export default { feed };
