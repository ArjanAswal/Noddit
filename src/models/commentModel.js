const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment must belong to a creator!'],
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Comment must belong to a post!'],
  },
  content: {
    type: String,
    required: [true, 'content cannot be empty!'],
    trim: true,
    maxlength: [1000, 'content cannot be longer than 1000 characters!'],
  },
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

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'creator',
    select:
      '-__v -passwordChangedAt -email -password -passwordChangedAt -resetPasswordToken -resetPasswordExpires -upvotedPosts -downvotedPosts -upvotedComments -downvotedComments -upvotedReplies -downvotedReplies',
  });

  next();
});

module.exports = model('Comment', commentSchema);
