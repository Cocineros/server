const { gql } = require('apollo-server-express');
const typeDefs = gql`
  type Profile {
    _id: ID
    firstName: String
    lastName: String
    username: String
    email: String
    password: String
    savedRecipes: [Recipe]!
  }

  type Recipe {
    _id: ID
    name: String
    description: String
    ingredients: [String]
    instructions: String
  }

  type Auth {
    token: ID!
    profile: Profile
  }

  type Query {
    me: Profile
    recipe: [ Recipe]
  }

  type Mutation {
    addProfile(firstName: String!, lastName: String!, username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addRecipe(name: String!,description: String!, ingredients: [String]!, instructions: String!): Recipe
    removeRecipe(_id: String!): Recipe
    editRecipe(_id: String!, name: String, description: String, ingredients: [String], instructions: String): Recipe
  }
`;

module.exports = typeDefs;
