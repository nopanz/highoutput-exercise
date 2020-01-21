
const dbUri = process.env.MONGODB_URI || 'mongodb://mongo:27017/highoutput-db';

const dbTestUri = 'mongodb://mongo:27017/mongo-test';
export default {
  dbUri,
  dbTestUri,
};
