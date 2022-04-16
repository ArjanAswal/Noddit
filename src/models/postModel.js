const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must belong to a creator!'],
  },
  title: {
    type: String,
    required: [true, 'Title cannot be empty!'],
    trim: true,
    maxlength: [50, 'Title cannot be longer than 50 characters!'],
  },
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: [true, 'Post must belong to a community!'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be longer than 1000 characters!'],
  },
  mediaURLs: [String],
  score: {
    type: Number,
    default: 0,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'creator',
    select:
      '-__v -passwordChangedAt -email -password -passwordChangedAt -resetPasswordToken -resetPasswordExpires -upvotedPosts -downvotedPosts -upvotedComments -downvotedComments -upvotedReplies -downvotedReplies',
  });

  this.populate({
    path: 'community',
    select: '-__v -bannedUsers',
  });

  next();
});

module.exports = model('Post', postSchema);
