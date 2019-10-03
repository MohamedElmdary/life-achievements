import { Context } from '@utils';
import { GraphQLResolveInfo } from 'graphql';

export type Middleware<T = any> = (
  resolver: Function,
  _: any,
  args: { data: T },
  context: Context,
  info: GraphQLResolveInfo | string
) => Promise<any> | never;
