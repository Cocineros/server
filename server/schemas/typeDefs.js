const { gql } = require('apollo-server-express');
const typeDefs = gql`
  type Profile {
    _id: ID
    username: String
    email: String
    password: String
    savedRecipes: [Recipe]!
  }

  type Recipe {
    _id: ID
    name: String
    description: String
    ingredients: String
    instructions: String
  }

  type Auth {
    token: ID!
    profile: Profile
  }

  type Query {
    me: Profile
  }

  type Mutation {
    addProfile(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addRecipe(name: String!,description: String!, ingredients: String!, instructions: String!): Recipe
    removeRecipe(recipeId: ID!): Recipe
  }
`;

module.exports = typeDefs;
