const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

require('dotenv').config();

const db = require('./db');
const models = require('./models');

const app = express();

const PORT = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const typeDefs = gql`
  type Note {
    id: ID!
    content: String!
    author: String!
  }

  input NewNote {
    content: String!
    author: String!
  }

  type Query {
    notes: [Note!]!
    note(id: ID!): Note!
  }

  type Mutation {
    createNote(input: NewNote!): Note
  }
`;

const resolvers = {
  Query: {
    async notes() {
      return await models.Note.find();
    },
    async note(_parent, { id }) {
      return await models.Note.findById(id);
    }
  },
  Mutation: {
    async createNote(_parent, { input }) {
      const { content, author } = input;
      return await models.Note.create({ content, author });
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: '/gql' });

app.get('/healthz', (req, res) => {
  res.send('OK');
});

db.connect(DB_HOST);

app.listen(PORT, () => {
  console.log(
    `Server listening on ${PORT} | GraphQL playground: ${server.graphqlPath}`
  );
});
