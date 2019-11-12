
const PORT = process.env.PORT || 3333;
const DB_USERNAME = process.env.DB_USERNAME || 'username';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'highoutput-db';

export {
    PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_PORT,
    DB_HOST,
    DB_NAME,
};
