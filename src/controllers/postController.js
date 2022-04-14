const Post = require('../models/postModel');
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

exports.getPosts = getDocuments(Post);

exports.getPost = getDocument(Post);

exports.createPost = createDocument(Post);

exports.deletePost = deleteDocument(Post);

exports.upvotePost = upvoteDocument(Post);

exports.downvotePost = downvoteDocument(Post);

exports.removeUpvote = removeUpvote(Post);

exports.removeDownvote = removeDownvote(Post);
