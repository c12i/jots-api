const http = require('http')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const { ApolloServer, PubSub } = require('apollo-server-express')
const depthLimit = require('graphql-depth-limit')
const { createComplexityLimitRule } = require('graphql-validation-complexity')

require('graphql-import-node/register')
require('dotenv').config()

const db = require('./db')
const typeDefs = require('./schema.graphql')
const resolvers = require('./resolvers')
const models = require('./models')
const getUser = require('./util/get-user')
const logger = require('./util/logger')
const loggerMiddleware = require('./middleware/logger-middleware')

const PORT = process.env.PORT || 4000
const DB_HOST = process.env.DB_HOST

const app = express()

app.use(helmet())
app.use(cors())
app.use(loggerMiddleware)

const pubsub = new PubSub()
const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    subscriptions: {
        path: '/ps'
    },
    validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
    context: ({ req, connection }) => {
        if (connection) {
            return {
                models,
                logger,
                pubsub
            }
        } else {
            const token = req.headers.authorization
            const user = getUser(token)
            return {
                models,
                user,
                logger,
                pubsub
            }
        }
    }
})

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

server.applyMiddleware({ app, path: '/gql' })

app.get('/healthz', (_, res) => {
    res.send('OK')
})

app.use((_, res) => res.status(404).send('404'))

db.connect(DB_HOST)

httpServer.listen(PORT, () => {
    console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
    console.log(
        `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
    )
})
