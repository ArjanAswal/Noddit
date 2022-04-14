const validator = require('validator');
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Please tell us your username!'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  about: {
    type: String,
    default: '',
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
    minlength: 8,
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
  upvotedReplies: {
    type: [Schema.Types.ObjectId],
    ref: 'Reply',
  },
  downvotedReplies: {
    type: [Schema.Types.ObjectId],
    ref: 'Reply',
  },
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'subscribedCommunities',
    select: '-__v -bannedUsers',
  });
  this.populate({
    path: 'upvotedPosts',
    select: '-__v',
  });
  this.populate({
    path: 'downvotedPosts',
    select: '-__v',
  });
  this.populate({
    path: 'upvotedComments',
    select: '-__v',
  });
  this.populate({
    path: 'downvotedComments',
    select: '-__v',
  });
  this.populate({
    path: 'upvotedReplies',
    select: '-__v',
  });
  this.populate({
    path: 'downvotedReplies',
    select: '-__v',
  });

  next();
});

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

module.exports = model('User', userSchema);
