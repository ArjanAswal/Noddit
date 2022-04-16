const Post = require('../models/postModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

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

exports.getFeed = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const features = new APIFeatures(
    Post.find().where('community').in(user.subscribedCommunities),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const posts = await features.query;

  if (!posts) {
    throw new AppError('Documents not found', 404);
  }

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
};
