const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *       - _id
 *       - creator
 *       - title
 *       - community
 *       properties:
 *         _id:
 *           type: string
 *           uniqueItems: true
 *         creator:
 *           type: string
 *           description: The user who created the post
 *         title:
 *           type: string
 *           description: The title of the post
 *         community:
 *           type: string
 *           description: The community the post is in
 *         description:
 *           type: string
 *           description: The description of the post
 *         mediaURLs:
 *           type: array
 *           items:
 *             type: string
 *             description: The media URL of the post
 *           description: The media URL of the post
 *         score:
 *           type: number
 *           description: The score of the post
 *         upvotes:
 *           type: number
 *           description: The number of upvotes the post has
 *         downvotes:
 *           type: number
 *           description: The number of downvotes the post has
 *         createdAt:
 *           type: string
 *           description: The date the post was created
 *     Posts:
 *       type: array
 *       "$ref": "#/components/schemas/Post"
 */

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

postSchema.index({ score: 1 });

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'creator',
    select:
      '-__v -passwordChangedAt -email -password -passwordChangedAt -resetPasswordToken -resetPasswordExpires -upvotedPosts -downvotedPosts -upvotedComments -downvotedComments',
  });

  this.populate({
    path: 'community',
    select: '-__v -bannedUsers',
  });

  next();
});

module.exports = model('Post', postSchema);
