import { Resolver } from '../resolver.interface';
import { ReplayCreateInput, Replay } from '@generated';

const createReplay: Resolver<ReplayCreateInput, Replay> = async (
  _,
  { data: { body, comment } },
  { req, mutation },
  info
) => {
  const {
    userId,
    achivementInfo: { id }
  } = <any>req;
  return await mutation.createReplay(
    {
      data: {
        achievement: {
          connect: {
            id
          }
        },
        author: {
          connect: {
            id: userId
          }
        },
        comment: {
          connect: {
            id: comment as string
          }
        },
        body
      }
    },
    info
  );
};

export default { createReplay };
