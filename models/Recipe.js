const { Schema } = require('mongoose');

const recipeSchema = new Schema({
  name: {
      type: String,
      required: true,
  },
  description: {
      type: String,
      maxlength: 100,
      required: false,
  },
  ingredients: [
      {
          type: String,
          required: true,
      },
  ],
  instructions: {
      type: String,
      required: true
  },


});

module.exports = recipeSchema;
