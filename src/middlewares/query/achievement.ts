import { Middleware } from '../middleware.interface';
import { validateAuth, validate, GqlError } from '@utils';
import { isNumeric } from 'validator';

const feed: Middleware<{ skip: number; limit: number }> = async (
    resolver,
    _,
    { data: { skip, limit } },
    { req, exists, mutation },
    info
) => {
    const userId = await validateAuth(req, exists, mutation);
    (<any>req).userId = userId;
    const { valid, errors } = validate(
        {
            field: 'skip',
            msg: 'Skip is required.',
            valid: isNumeric(skip.toString())
        },
        {
            field: 'limit',
            msg: 'Limit is required.',
            valid: isNumeric(limit.toString())
        }
    );
    if (valid) {
        return resolver();
    }
    throw GqlError(errors);
};

const userAchievements: Middleware<{}> = async (
    resolver,
    _,
    { data },
    { req, exists, mutation },
    info
) => {
    const userId = await validateAuth(req, exists, mutation);
    (<any>req).userId = userId;
    return resolver();
};

const getAchievementById: Middleware<{ id: string }> = async (
    resolver,
    _,
    { data: { id } },
    { req, exists, mutation },
    info
) => {
    const userId = await validateAuth(req, exists, mutation);
    const { valid, errors } = validate({
        field: 'id',
        msg: 'Achievement was not found.',
        valid: await exists.Achievement({
            id,
            author: {
                id: userId
            }
        })
    });
    if (valid) {
        return resolver();
    }
    throw GqlError(errors);
};

export default { feed, userAchievements, getAchievementById };
