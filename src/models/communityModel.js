const { Schema, model } = require('mongoose');

const communitySchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Community must belong to a creator!'],
  },
  name: {
    type: String,
    required: [true, 'Community must have a name!'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Community name must be at least 3 characters long!'],
    maxlength: [25, 'Community name must be at most 25 characters long!'],
  },
  subscribers: {
    type: Number,
    default: 0,
  },
  moderators: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  bannedUsers: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  rules: {
    type: String,
  },
  avatar: {
    type: String,
    default: '',
  },
  cover: {
    type: String,
    default: '',
  },
  description: {
    type: String,
  },
  welcomeMessage: {
    type: String,
  },
  userFlairs: {
    type: [String],
  },
  postFlairs: {
    type: [String],
  },
  score: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

communitySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'creator',
    select:
      '-__v -passwordChangedAt -email -password -passwordChangedAt -resetPasswordToken -resetPasswordExpires -upvotedPosts -downvotedPosts -upvotedComments -downvotedComments -upvotedReplies -downvotedReplies',
  });

  this.populate({
    path: 'moderators',
    select:
      '-__v -passwordChangedAt -email -password -passwordChangedAt -resetPasswordToken -resetPasswordExpires -upvotedPosts -downvotedPosts -upvotedComments -downvotedComments -upvotedReplies -downvotedReplies',
  });

  next();
});

module.exports = model('Community', communitySchema);
