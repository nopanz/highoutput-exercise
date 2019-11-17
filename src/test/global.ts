import mongoose from 'mongoose';
import DatabaseConfig from '../config/database';

before((done) => {
  mongoose.connect(DatabaseConfig.dbTestUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true ,
    useCreateIndex: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection err:'));
  db.once('open', () => {
    done();
  });
});

after(async () => {
  const connection = mongoose.connection;
  const collections = await connection.db.collections();
  for (const collection of collections) {
    await collection.drop();
  }
  connection.close();
});
