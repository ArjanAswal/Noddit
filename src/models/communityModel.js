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
});

communitySchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'creator',
  //     select:
  //       '-__v -passwordChangedAt -email -password -passwordChangedAt -resetPasswordToken -resetPasswordExpires -upvotedPosts -downvotedPosts -upvotedComments -downvotedComments -upvotedReplies -downvotedReplies',
  //   });

  //   this.populate({
  //     path: 'moderators',
  //     select:
  //       '-__v -passwordChangedAt -email -password -passwordChangedAt -resetPasswordToken -resetPasswordExpires -upvotedPosts -downvotedPosts -upvotedComments -downvotedComments -upvotedReplies -downvotedReplies',
  //   });

  next();
});

module.exports = model('Community', communitySchema);
