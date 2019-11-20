
import path from 'path';
import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';

const resolversArray = fileLoader(path.join(__dirname, './**/!(index.ts)'), { extensions: ['.ts'] });
export default mergeResolvers(resolversArray);
