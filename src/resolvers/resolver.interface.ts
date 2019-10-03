import { Context } from '@utils';
import { GraphQLResolveInfo } from 'graphql';

export type Resolver<T = any, U = any> = (
  _: any,
  args: { data: T },
  ctx: Context,
  info: GraphQLResolveInfo | string
) => U | Promise<U>;
