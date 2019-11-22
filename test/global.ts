import DatabaseConfig from '../src/config/database';
import redis from '../src/app/services/redis';
import app from '../src/app/app';

before((done) => {
  app.mongoose.connect(DatabaseConfig.dbTestUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  const db = app.mongoose.connection;
  // eslint-disable-next-line no-console
  db.on('error', console.error.bind(console, 'connection err:'));
  db.once('open', () => {
    done();
  });
});

after(async () => {
  const { connection } = app.mongoose;
  await connection.db.dropDatabase();
  await connection.close();
  await redis.quit();
});
