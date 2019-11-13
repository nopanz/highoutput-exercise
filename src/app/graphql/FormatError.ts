import { GraphQLError } from 'graphql';

export default (error: GraphQLError) => {

  const { message , extensions } = error;

  let code: string | undefined;

  if (extensions !== undefined) {
    code = extensions['exception']['code'];
  }
  if (!code) {
    console.error(error);
  }
  return { message  , code: code || 'INTERNAL_SERVER_ERROR' };
};
