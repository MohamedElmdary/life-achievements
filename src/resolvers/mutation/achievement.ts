import { Resolver } from '../resolver.interface';
import {
  AchievementCreateInput,
  Achievement,
  CommentCreateInput
} from '@generated';

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

const createComment: Resolver<CommentCreateInput, Comment> = async (
  _,
  { data: { achievement, body } },
  { req, mutation },
  info
) => {
  return await mutation.createComment(
    {
      data: {
        achievement: {
          connect: {
            id: achievement as string
          }
        },
        author: {
          connect: {
            id: (<any>req).userId
          }
        },
        body
      }
    },
    info
  );
};

export default { createAchievement, createComment };
