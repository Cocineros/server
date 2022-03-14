const { AuthenticationError } = require('apollo-server-express');
const { Profile, Recipe } = require('../models');
const recipeSchema = require('../models/Recipe');
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
      addProfile: async (parent, { firstName, lastName, username, email, password }) => {
        const profile = await Profile.create({ firstName, lastName, username, email, password });
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
        console.log(context)
        if (context.profile) {
          await Profile.findOneAndUpdate(
            { _id: context.profile._id },
            { $addToSet: { savedRecipes: args } },
            {
                new: true
            }
          );
  
          return args;
        }
        throw new AuthenticationError('You need to be logged in!');
      },

      removeRecipe: async (parent, args, context) => {
        if (context.profile) {
          await Profile.findOneAndUpdate(
            { _id: context.profile._id },
            { $pull: { savedRecipes: args } },
            {
                new: true
            }
          );
  
          return args;
        }
        throw new AuthenticationError('You need to be logged in!');
      },

      editRecipe: async (parent, args, context) => {
        console.log("args", args)
        if (context.profile) {
          const currentProfile = await Profile.findOne({ _id: context.profile._id })
          console.log("current profile", currentProfile)
          const mutatedProfile = {...currentProfile.savedRecipes, ...args}
          await Profile.findOneAndUpdate(
            // { _id: savedRecipes._id}
            { _id: context.profile._id},
            { $set: {  savedRecipes:  mutatedProfile} },
            {
              new: true
            }
          );

          return args
        }
      }

    },
  };
  
  module.exports = resolvers;
  