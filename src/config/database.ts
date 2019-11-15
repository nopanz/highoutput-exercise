
const DB_USER = process.env.DB_USER || 'username';
const DB_TEST_USER = process.env.DB_TEST_USER || 'username';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
const DB_TEST_PASSWORD = process.env.DB_PASSWORD || 'password';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_TEST_PORT = process.env.DB_TEST_PORT || 27018;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'highoutput-db';
const DB_TEST_NAME = process.env.DB_NAME || 'highoutput-test-db';

const dbUri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const dbTestUri = `mongodb://${DB_TEST_USER}:${DB_TEST_PASSWORD}@${DB_HOST}:${DB_TEST_PORT}/${DB_TEST_NAME}`;
export default {
  dbUri,
  dbTestUri,
};
