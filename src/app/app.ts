/* eslint-disable no-console */
import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import mongoose from 'mongoose';
import * as graphlSchema from './graphql';
import DatabaseConfig from '../config/database';
import { PORT } from '../config/server';

const server = new ApolloServer(graphlSchema);

const app = new Koa();

server.applyMiddleware({ app });

export default {
  start: () => {
    app.listen({ port: PORT }, () => {
      mongoose.connect(DatabaseConfig.dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });

      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection err:'));
      db.once('open', () => {
        console.log('Database Connected');
      });
      console.log(`Server ready at http://localhost:3333${server.graphqlPath}`);
    });
  },
  callback: () => app.callback(),
};
