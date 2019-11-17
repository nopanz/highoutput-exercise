import mongoose from 'mongoose';
import DatabaseConfig from '../config/database';

before((done) => {
  mongoose.connect(DatabaseConfig.dbTestUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  const db = mongoose.connection;
  // eslint-disable-next-line no-console
  db.on('error', console.error.bind(console, 'connection err:'));
  db.once('open', () => {
    done();
  });
});

after(async () => {
  const { connection } = mongoose;
  const collections = await connection.db.collections();

  const toDropCollection = collections.map((collection) => collection.drop());
  await Promise.all(toDropCollection);
  connection.close();
});
