const { Schema, model } = require('mongoose');

const replySchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reply must belong to a creator!'],
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: [true, 'Reply must belong to a comment!'],
  },
  content: {
    type: String,
    required: [true, 'content cannot be empty!'],
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
});

replySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'creator',
    select:
      '-__v -passwordChangedAt -email -password -passwordChangedAt -resetPasswordToken -resetPasswordExpires -upvotedPosts -downvotedPosts -upvotedComments -downvotedComments -upvotedReplies -downvotedReplies',
  });

  next();
});

module.exports = model('Reply', replySchema);
