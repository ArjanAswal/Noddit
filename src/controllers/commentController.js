const Comment = require('../models/commentModel');
const {
  getDocuments,
  getDocument,
  createDocument,
  deleteDocument,
  upvoteDocument,
  downvoteDocument,
} = require('../controllers/handlerFactory');

exports.getComments = getDocuments(Comment);

exports.getComment = getDocument(Comment);

exports.createComment = createDocument(Comment);

exports.deleteComment = deleteDocument(Comment);

exports.upvoteComment = upvoteDocument(Comment);

exports.downvoteComment = downvoteDocument(Comment);
