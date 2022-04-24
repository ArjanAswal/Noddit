const Comment = require('../models/commentModel');
const {
  getDocuments,
  getDocument,
  createDocument,
  deleteDocument,
  upvoteDocument,
  downvoteDocument,
  removeUpvote,
  removeDownvote,
} = require('../controllers/handlerFactory');

exports.getComments = getDocuments(Comment);

exports.getComment = getDocument(Comment);

exports.createComment = createDocument(Comment);

exports.deleteComment = deleteDocument(Comment);

exports.upvoteComment = upvoteDocument(Comment);

exports.downvoteComment = downvoteDocument(Comment);

exports.removeUpvote = removeUpvote(Comment);

exports.removeDownvote = removeDownvote(Comment);
