const { gql } = require('apollo-server-express')

module.exports = gql`
    scalar DateTime

    type Note {
        id: ID!
        content: String!
        author: User!
        favoriteCount: Int!
        favoritedBy: [User!]
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type NoteFeed {
        notes: [Note!]!
        cursor: String!
        hasNextPage: Boolean!
    }

    type User {
        id: ID!
        username: String!
        email: String!
        avatar: String!
        notes: [Note!]!
        favorites: [Note!]!
    }

    input SignUpInput {
        username: String!
        email: String!
        password: String!
    }

    input SignInInput {
        username: String
        email: String
        password: String!
    }

    type Query {
        notes: [Note!]!
        noteFeed(cursor: String): NoteFeed
        note(id: ID!): Note!
        users: [User!]!
        user(username: String!): User!
        me: User!
    }

    type Mutation {
        signUp(input: SignUpInput!): String!
        signIn(input: SignInInput!): String!
        createNote(content: String!): Note!
        updateNote(id: ID!, content: String!): Note!
        deleteNote(id: ID!): Boolean!
        toggleFavorite(id: ID!): Note!
    }

    type Subscription {
        noteFavorited(id: ID!): Note!
    }
`
