const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Community:
 *       type: object
 *       required:
 *       - _id
 *       - creator
 *       - name
 *       properties:
 *         _id:
 *           type: string
 *           uniqueItems: true
 *         creator:
 *           type: string
 *           description: The user who created the post
 *         name:
 *           type: string
 *           description: The name of the post
 *         subscribers:
 *           type: number
 *         moderators:
 *           type: array
 *           items:
 *             type: string
 *             description: The moderators of the community
 *         bannedUsers:
 *           type: array
 *           items:
 *             type: string
 *             description: The users banned from the community
 *         rules:
 *           type: string
 *         avatar:
 *           type: string
 *         cover:
 *           type: string
 *         description:
 *           type: string
 *           description: The description of the post
 *         welcomeMessage:
 *           type: string
 *         score:
 *           type: number
 *           description: The score of the post
 *         createdAt:
 *           type: string
 *           description: The date the post was created
 *     Communities:
 *       type: array
 *       "$ref": "#/components/schemas/Community"
 */

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
