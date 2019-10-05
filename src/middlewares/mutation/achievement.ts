import { Middleware } from '../middleware.interface';
import { AchievementCreateInput, CommentCreateInput } from '@generated';
import { validate, GqlError, validateAuth } from '@utils';
import { isEmpty, isLength } from 'validator';

/* 

  title: String!
  description: String!
  days: Int!
  type: Type!
  published: Boolean!

*/

const createAchievement: Middleware<AchievementCreateInput> = async (
  resolver,
  _,
  { data },
  { req, exists, mutation },
  info
) => {
  const userId = await validateAuth(req, exists, mutation);
  console.log(userId);
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
      valid: !isEmpty(description) && isLength(title, { min: 20, max: 400 })
    },
    {
      field: 'type',
      msg: 'Type must be (Do It) or (get rid of).',
      valid: type === 'DO_IT' || type === 'GET_RID_OF'
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

const createComment: Middleware<CommentCreateInput> = async (
  resolver,
  _,
  { data: { body, achievement } },
  { req, exists, mutation },
  info
) => {
  const userId = await validateAuth(req, exists, mutation);
  console.log(userId);
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

export default { createAchievement, createComment };
