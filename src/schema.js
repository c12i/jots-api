const { gql } = require('apollo-server-express');

module.exports = gql`
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
    createNote(input: NewNote!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
  }
`;
