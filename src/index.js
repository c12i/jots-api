const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();

const db = require('./db');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const models = require('./models');

const PORT = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { models };
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
