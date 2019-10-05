import { Middleware } from '../middleware.interface';
import { ReplayCreateInput, Comment } from '@generated';
import { validateAuth, validate, GqlError } from '@utils';
import { isEmpty, isLength } from 'validator';

const createReplay: Middleware<ReplayCreateInput> = async (
  resolver,
  _,
  { data: { body, comment } },
  { req, exists, mutation, query },
  info
) => {
  const userId = await validateAuth(req, exists, mutation);
  const achivementInfo = await query.comment(
    {
      where: {
        id: comment as string
      }
    },
    '{ achievement { id published } }'
  );

  const { valid, errors } = validate(
    {
      field: 'body',
      msg: 'Body is required.',
      valid: !isEmpty(body.trim()) && isLength(body, { min: 1 })
    },
    {
      field: 'comment',
      msg: 'Comment was not found.',
      valid:
        !!achivementInfo &&
        achivementInfo.achievement &&
        achivementInfo.achievement.published
    }
  );
  if (valid) {
    (<any>req).userId = userId;
    (<any>req).achivementInfo = (achivementInfo as Comment).achievement;
    return resolver();
  }
  throw GqlError(errors);
};

export default { createReplay };
