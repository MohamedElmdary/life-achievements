import { Resolver } from '../resolver.interface';
import { AchievementCreateInput, Achievement } from '@generated';

const createAchievement: Resolver<AchievementCreateInput, Achievement> = async (
  _,
  args,
  { mutation },
  info
) => {
  // not completed!
  return await mutation.createAchievement(args, info);
};

export default { createAchievement };
