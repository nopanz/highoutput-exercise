/* eslint-disable no-console */
import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import redis from './services/redis';
import * as graphlSchema from './graphql';
import DatabaseConfig from '../config/database';
import { PORT } from '../config/server';

const server = new ApolloServer(graphlSchema);

const app = new Koa();

app.use(bodyParser());

app.use(async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  const requestId: string | undefined = ctx.request.headers['x-request-id'];
  const reqBody = ctx.request.body;
  if (requestId && (reqBody && reqBody.operationName !== 'IntrospectionQuery')) {
    const cacheResponse = await redis.get(requestId);
    if (cacheResponse) {
      ctx.body = cacheResponse;
      ctx.status = 200;
      return;
    }
  }
  await next();
  if (requestId && (reqBody && reqBody.operationName !== 'IntrospectionQuery')) {
    const body: {errors: object | undefined} = JSON.parse(ctx.response.body);
    if (!body.errors) {
      redis.set(requestId, JSON.stringify(body));
    }
  }
});
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
