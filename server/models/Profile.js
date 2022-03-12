const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');


const recipeSchema = require('./Recipe');

const profileSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // ref activity 26 if issues
    savedRecipes: [recipeSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
profileSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
profileSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// when we query a profile, we'll also get another field called `bookCount` with the number of saved books we have
profileSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

const Profile = model('profile', profileSchema);

module.exports = Profile;
