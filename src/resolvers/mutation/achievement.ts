import { Resolver } from '../resolver.interface';
import { AchievementCreateInput, Achievement } from '@generated';

const createAchievement: Resolver<AchievementCreateInput, Achievement> = async (
    _,
    { data: { title, description, type, days, published } },
    { req, mutation },
    info
) => {
    return await mutation.createAchievement(
        {
            data: {
                title,
                description,
                type: type as 'DO_IT' | 'GET_RID_OF',
                days: {
                    set: Array(+(days as number | string)).fill(false)
                },
                published: !!published,
                author: {
                    connect: {
                        id: (<any>req).userId
                    }
                }
            }
        },
        info
    );
};

const achievementPublishment: (
    x: boolean
) => Resolver<{ id: string }, Achievement> = published => {
    return async (_, { data: { id } }, { mutation }, info) => {
        return (await mutation.updateAchievement(
            {
                where: {
                    id
                },
                data: {
                    published
                }
            },
            info
        )) as Achievement;
    };
};

const completeDay: Resolver<{ achievement_id: string }, Achievement> = async (
    _,
    { data: { achievement_id } },
    { req, mutation },
    info
) => {
    const createdAt = (<any>req).achv.created_at;
    const days: boolean[] = (<any>req).achv.days;
    const timeDiff = new Date().getTime() - new Date(createdAt).getTime();
    const idx = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (idx > 0) {
        days[idx - 1] = true;
    }
    return (await mutation.updateAchievement(
        {
            where: {
                id: achievement_id
            },
            data: {
                days: {
                    set: days
                }
            }
        },
        info
    )) as Achievement;
};

export default {
    createAchievement,
    publishAchievement: achievementPublishment(true),
    unPublishAchievement: achievementPublishment(false),
    completeDay
};
