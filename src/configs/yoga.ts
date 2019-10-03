import { Options } from 'graphql-yoga';

const options: Options = {
  debug: !!process.env.DEVELOPMENT,
  playground: !!process.env.DEVELOPMENT ? '/playground' : undefined,
  port: process.env.PORT,
  formatError({ originalError }: any) {
    return originalError.message;
  },
  formatResponse(r: any) {
    if (r.errors && !r.data) {
      return {
        data: null,
        errors: [].concat.apply([], r.errors)
      };
    }
    return {
      ...r,
      errors: null
    };
  }
};

export { options };
