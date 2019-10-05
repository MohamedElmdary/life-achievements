import { Resolver } from '../resolver.interface';
import { CommentCreateInput } from '@generated';

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

export default { createComment };
