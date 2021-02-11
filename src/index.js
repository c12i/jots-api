const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
require('dotenv').config();

const db = require('./db');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const models = require('./models');
const getUser = require('./util/get-user');
const logger = require('./util/logger');
const loggerMiddleware = require('./middleware/logger-middleware');

const PORT = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();

app.use(helmet());
app.use(cors());
app.use(loggerMiddleware);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = getUser(token);
    return { models, user, logger };
  }
});

server.applyMiddleware({ app, path: '/gql' });

app.get('/healthz', (_, res) => {
  res.send('OK');
});

app.use((_, res) => res.status(404).send('404'));

db.connect(DB_HOST);

app.listen(PORT, () => {
  console.log(
    `Server listening on ${PORT} | GraphQL playground: ${server.graphqlPath}`
  );
});
