import Koa from 'koa'
import * as graphlSchema from './graphql'
import { ApolloServer } from 'apollo-server-koa'

const server = new ApolloServer(graphlSchema)

const app = new Koa()

server.applyMiddleware({ app })

export default {
    start: () => {
        app.listen({ port: 3333 }, () => console.log(`Server ready at http://localhost:3333${server.graphqlPath}`))
    }
}