const validator = require('validator');
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *       - _id
 *       - username
 *       - email
 *       properties:
 *         _id:
 *           type: string
 *           uniqueItems: true
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         about:
 *           type: string
 *         avatar:
 *           type: string
 *         subscribedCommunities:
 *           type: array
 *           "$ref": "#/components/schemas/Community"
 *         karma:
 *           type: number
 *           description: The karma of the user
 *         createdAt:
 *           type: string
 *           description: The date the user was created
 *     Users:
 *       type: array
 *       "$ref": "#/components/schemas/User"
 */

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Please tell us your username!'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters long!'],
    maxlength: [15, 'Username must be at most 15 characters long!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  about: {
    type: String,
    default: '',
    trim: true,
    maxlength: [200, 'About must be at most 200 characters long!'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  avatar: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  subscribedCommunities: {
    type: [Schema.Types.ObjectId],
    ref: 'Community',
  },
  karma: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  upvotedPosts: {
    type: [Schema.Types.ObjectId],
    ref: 'Post',
  },
  downvotedPosts: {
    type: [Schema.Types.ObjectId],
    ref: 'Post',
  },
  upvotedComments: {
    type: [Schema.Types.ObjectId],
    ref: 'Comment',
  },
  downvotedComments: {
    type: [Schema.Types.ObjectId],
    ref: 'Comment',
  },
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'subscribedCommunities',
    select: '-__v -bannedUsers -creator -moderators -bannedUsers',
  });
  // this.populate({
  //   path: 'upvotedPosts',
  //   select: '-__v',
  // });
  // this.populate({
  //   path: 'downvotedPosts',
  //   select: '-__v',
  // });
  // this.populate({
  //   path: 'upvotedComments',
  //   select: '-__v',
  // });
  // this.populate({
  //   path: 'downvotedComments',
  //   select: '-__v',
  // });

  next();
});

// Change password
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = model('User', userSchema);
