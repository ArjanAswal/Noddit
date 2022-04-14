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
  },
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: [true, 'Post must belong to a community!'],
  },
  description: {
    type: String,
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
