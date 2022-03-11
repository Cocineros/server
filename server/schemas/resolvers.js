const { AuthenticationError } = require('apollo-server-express');
const { Profile, Recipe } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
      me: async (parent, args, context) => {
        if (context.profile) {
          return Profile.findOne({ _id: context.profile._id }).populate('savedRecipes');
        }
        throw new AuthenticationError('You need to be logged in!');
      },
    },
  
    Mutation: {
      addProfile: async (parent, { username, email, password }) => {
        const profile = await Profile.create({ username, email, password });
        const token = signToken(profile);
        return { token, profile };
      },
      login: async (parent, { email, password }) => {
        const profile = await Profile.findOne({ email });
  
        if (!profile) {
          throw new AuthenticationError('Incorrect credentials!');
        }
  
        const correctPw = await profile.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(profile);
  
        return { token, profile };
      },
      addRecipe: async (parent,  args , context) => {
        if (context.profile) {
          const recipe = await Recipe.create({
            args,
          });
  
          await Profile.findOneAndUpdate(
            { _id: context.profile._id },
            { $addToSet: { savedRecipes: recipe._id } },
            {
                new: true
            }
          );
  
          return recipe;
        }
        throw new AuthenticationError('You need to be logged in!');
      },

      removeRecipe: async (parent, { recipeId }, context) => {
        if (context.profile) {
          const profile = await Profile.findOneAndDelete({
            _id: recipeId,
          });
  
          await Profile.findOneAndUpdate(
            { _id: context.profile._id },
            { $pull: { savedRecipes: recipe._id } },
            {
                new: true
            }
          );
  
          return profile;
        }
        throw new AuthenticationError('You need to be logged in!');
      },

    },
  };
  
  module.exports = resolvers;
  