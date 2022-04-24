const {Schema, model} = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *       - _id
 *       - creator
 *       - parent
 *       - content
 *       - community
 *       properties:
 *         _id:
 *           type: string
 *           uniqueItems: true
 *         creator:
 *           type: string
 *           description: The user who created the comment
 *         parent:
 *           type: string
 *           description: The parent of the comment
 *         content:
 *           type: string
 *         community:
 *           type: string
 *         upvotes:
 *           type: number
 *         downvotes:
 *           type: number
 *         score:
 *           type: number
 *           description: The score of the comment
 *         createdAt:
 *           type: string
 *           description: The date the comment was created
 *     Comments:
 *       type: array
 *       "$ref": "#/components/schemas/Comment"
 */

const commentSchema = new Schema({
  parentModel : {
    type : String,
    required : true,
    enum : [ 'Post', 'Comment' ],
  },
  creator : {
    type : Schema.Types.ObjectId,
    ref : 'User',
    required : [ true, 'Comment must belong to a creator!' ],
  },
  parent : {
    type : Schema.Types.ObjectId,
    // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
    // will look at the `parentModel` property to find the right model.
    refPath : 'parentModel',
    required : [ true, 'Comment must belong to a parent!' ],
  },
  content : {
    type : String,
    required : [ true, 'content cannot be empty!' ],
    trim : true,
    maxlength : [ 1000, 'content cannot be longer than 1000 characters!' ],
  },
  community : {
    type : Schema.Types.ObjectId,
    ref : 'Community',
    required : [ true, 'Comment must belong to a community!' ],
  },
  score : {
    type : Number,
    default : 0,
  },
  upvotes : {
    type : Number,
    default : 0,
  },
  downvotes : {
    type : Number,
    default : 0,
  },
  createdAt : {
    type : Date,
    default : Date.now(),
  },
});

commentSchema.pre(/^find/, function(next) {
  this.populate({
    path : 'creator',
    select :
        '-__v -passwordChangedAt -email -password -passwordChangedAt -resetPasswordToken -resetPasswordExpires -upvotedPosts -downvotedPosts -upvotedComments -downvotedComments',
  });

  this.populate({
    path : 'parent',
    select : '-__v -parent',
  });

  next();
});

module.exports = model('Comment', commentSchema);
