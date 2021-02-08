const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();
const port = process.env.PORT || 4000;

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello'
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: '/gql' });

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(port, () => {
  console.log(
    `Server listening on ${port} | GraphQL playground: ${server.graphqlPath}`
  );
});
