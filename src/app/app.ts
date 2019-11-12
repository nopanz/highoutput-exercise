import Koa from 'koa';
import * as graphlSchema from './graphql';
import { ApolloServer } from 'apollo-server-koa';
import { PORT, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_HOST, DB_NAME } from '../config/env';
import mongoose from 'mongoose';

const server = new ApolloServer(graphlSchema);

const app = new Koa();

server.applyMiddleware({ app });

export default {
  start: () => {
    app.listen({ port: PORT }, () => {
      const dbUri = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
      mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection err:'));
      db.once('open', () => {
        console.log('Database Connected');
      });
      console.log(`Server ready at http://localhost:3333${server.graphqlPath}`);
    });
  },
};
