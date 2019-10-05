import { Middleware } from '../middleware.interface';
import { CommentCreateInput } from '@generated';
import { validate, GqlError, validateAuth } from '@utils';
import { isEmpty, isLength } from 'validator';

const createComment: Middleware<CommentCreateInput> = async (
  resolver,
  _,
  { data: { body, achievement } },
  { req, exists, mutation },
  info
) => {
  const userId = await validateAuth(req, exists, mutation);
  (<any>req).userId = userId;

  const { valid, errors } = validate(
    {
      field: 'body',
      msg: 'Body is required.',
      valid: !isEmpty(body.trim()) && isLength(body, { min: 1 })
    },
    {
      field: 'achievement',
      msg: 'Achievement was not found.',
      valid: await exists.Achievement({
        published: true,
        id: achievement as string
      })
    }
  );
  if (valid) {
    return resolver();
  }
  throw GqlError(errors);
};

export default { createComment };
