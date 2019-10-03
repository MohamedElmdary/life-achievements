import { Request } from 'express';
import { Query, Mutation, Subscription, Exists } from '@generated';

export interface Context {
  req: Request;
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
  exists: Exists;
}
