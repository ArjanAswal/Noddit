const Reply = require('../models/replyModel');
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

exports.getReplies = getDocuments(Reply);

exports.getReply = getDocument(Reply);

exports.createReply = createDocument(Reply);

exports.deleteReply = deleteDocument(Reply);

exports.upvoteReply = upvoteDocument(Reply);

exports.downvoteReply = downvoteDocument(Reply);

exports.removeUpvote = removeUpvote(Reply);

exports.removeDownvote = removeDownvote(Reply);
