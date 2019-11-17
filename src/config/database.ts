
const DB_USER = process.env.DB_USER || 'username';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'highoutput-db';

const dbUri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const dbTestUri = 'mongodb://localhost:27017/mongo-test';
export default {
  dbUri,
  dbTestUri,
};
