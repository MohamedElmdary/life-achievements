import { Resolver } from '../resolver.interface';
import { Achievement } from '@generated';

const feed: Resolver<{ limit: number; skip: number }, Achievement[]> = async (
    _,
    { data: { skip, limit } },
    { req, query },
    info
) => {
    const { userId } = <any>req;
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

const userAchievements: Resolver<{ active?: boolean }, Achievement[]> = async (
    _,
    { data },
    { req, query },
    info
) => {
    const { userId } = <any>req;
    const where: any = {
        author: {
            id: userId
        }
    };
    if (data?.active === true || data?.active === false) {
        where.completed = !data.active;
    }
    return await query.achievements({
        where
    });
};

export default { feed, userAchievements };
