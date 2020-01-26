import { Middleware } from '../middleware.interface';
import { AchievementCreateInput, CommentCreateInput } from '@generated';
import { validate, GqlError, validateAuth } from '@utils';
import { isEmpty, isLength } from 'validator';

const createAchievement: Middleware<AchievementCreateInput> = async (
    resolver,
    _,
    { data },
    { req, exists, mutation },
    info
) => {
    const userId = await validateAuth(req, exists, mutation);
    (<any>req).userId = userId;

    const { title, description, type, days } = data;
    const { valid, errors } = validate(
        {
            field: 'title',
            msg: 'Title min length is 4 and max length is 100.',
            valid: !isEmpty(title) && isLength(title, { min: 4, max: 100 })
        },
        {
            field: 'description',
            msg: 'Description min length is 20 and max length is 400.',
            valid:
                !isEmpty(description) &&
                isLength(description, { min: 20, max: 400 })
        },
        {
            field: 'type',
            msg: 'Type must be (Do It) or (get rid of).',
            valid: type === 'DO_IT' || type === 'GET_RID_OF'
        },
        {
            field: 'days',
            msg: 'Days must be Integer and at least 5',
            valid: /\d+/.test(days + '') && Number(days) >= 5
        }
    );
    if (valid) {
        return resolver();
    }
    throw GqlError(errors);
};

const achievementPublishment: Middleware<{ id: string }> = async (
    resolver,
    _,
    { data: { id } },
    { req, exists, mutation },
    info
) => {
    const userId = await validateAuth(req, exists, mutation);
    const { valid, errors } = validate({
        field: 'achievement',
        msg: 'Achievement was not found.',
        valid: await exists.Achievement({
            id,
            author: { id: userId }
        })
    });
    if (valid) {
        return resolver();
    }
    throw GqlError(errors);
};

const completeDay: Middleware<{ achievement_id: string }> = async (
    resolver,
    _,
    { data: { achievement_id } },
    { req, exists, mutation, query },
    info
) => {
    const userId = await validateAuth(req, exists, mutation);
    const achv = (
        await query.achievements(
            {
                where: {
                    id: achievement_id,
                    author: {
                        id: userId
                    }
                }
            },
            '{ id days created_at }'
        )
    )[0];
    const { valid, errors } = validate({
        field: 'achievement',
        msg: 'Achievement was not found.',
        valid: !!achv
    });
    (<any>req).achv = achv;
    if (valid) {
        return resolver();
    }
    throw GqlError(errors);
};

export default {
    createAchievement,
    publishAchievement: achievementPublishment,
    unPublishAchievement: achievementPublishment,
    completeDay
};
