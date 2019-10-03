import { Options } from 'graphql-yoga';

const options: Options = {
  debug: !!process.env.DEVELOPMENT,
  playground: !!process.env.DEVELOPMENT ? '/playground' : undefined,
  port: process.env.PORT,
  formatError(e: any) {
    return e;
  },
  formatResponse(r: any) {
    return r;
  }
};

export { options };
