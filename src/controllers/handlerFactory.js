require('express-async-errors');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Community = require('./../models/communityModel');
const Post = require('./../models/postModel');
const Comment = require('./../models/commentModel');
const Reply = require('./../models/replyModel');
const User = require('./../models/userModel');

exports.getDocuments = Model => async (req, res, next) => {
  const features = new APIFeatures(Model.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const documents = await features.query;

  if (!documents) {
    throw new AppError('documents not found', 404);
  }

  res.status(200).json({
    status: 'success',
    results: documents.length,
    data: {
      documents,
    },
  });
};

exports.getDocument = Model => async (req, res, next) => {
  const document = await Model.findById(req.params.id);

  if (!document) {
    throw new AppError('document not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      document,
    },
  });
};

exports.createDocument = Model => async (req, res, next) => {
  const { title, description, mediaURLs, content, post, comment, community } =
    req.body;
  let parent;
  let document;
  const user = req.user;

  const communityDoc = await Community.findById(community);
  const bannedUsers = communityDoc?.bannedUsers?.map(userId =>
    userId.toString()
  );

  if (bannedUsers?.includes(user.id)) {
    throw new AppError('You are banned from this community', 400);
  }

  if (Model.modelName === 'Comment') {
    parent = await Post.findById(post);
    if (!parent) throw new Error("Post doesn't exist");
    document = await Model.create({
      creator: user.id,
      post,
      content,
    });
  } else if (Model.modelName === 'Reply') {
    parent =
      (await Comment.findById(comment)) ?? (await Reply.findById(comment)); // nesting of replies

    if (!parent) throw new Error("Comment doesn't exist");
    document = await Model.create({
      creator: user.id,
      comment,
      content,
    });
  } else if (Model.modelName === 'Post') {
    document = await Model.create({
      creator: user.id,
      title,
      description,
      mediaURLs,
      community,
    });
  } else {
    throw new Error('Invalid model name');
  }

  res.status(200).json({
    status: 'success',
    data: {
      document,
    },
  });
};

exports.deleteDocument = Model => async (req, res, next) => {
  const user = req.user;

  const document = await Model.findById(req.params.id);
  const community = await Model.findById(document.community);
  const moderators = community.moderators.map(moderator =>
    moderator._id.toString()
  );

  if (!document) {
    throw new AppError('document not found', 404);
  }

  if (
    document.creator.toString() !== user.id &&
    user.role !== 'admin' &&
    !moderators.includes(user.id)
  ) {
    throw new AppError('You are not authorized to delete this document', 401);
  }

  await Model.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.upvoteDocument = Model => async (req, res, next) => {
  const document = await Model.findById(req.params.id);
  const user = req.user;

  if (!document) {
    throw new AppError('document not found', 404);
  }

  const userDoc = await User.findById(user?.id);
  const creator = await User.findById(document.creator);

  let upvotedDocs = 'upvotedDocs';
  let downvotedDocs = 'downvotedDocs';

  if (Model.modelName === 'Post') {
    upvotedDocs = 'upvotedPosts';
    downvotedDocs = 'downvotedPosts';
  } else if (Model.modelName === 'Comment') {
    upvotedDocs = 'upvotedComments';
    downvotedDocs = 'downvotedComments';
  } else if (Model.modelName === 'Reply') {
    upvotedDocs = 'upvotedReplies';
    downvotedDocs = 'downvotedReplies';
  }

  const upvotedDocsIds = userDoc[upvotedDocs].map(doc => doc._id.toString());
  const downvotedDocsIds = userDoc[downvotedDocs].map(doc =>
    doc._id.toString()
  );

  if (upvotedDocsIds.includes(document?.id)) {
    throw new AppError('You have already upvoted', 400);
  } else {
    if (downvotedDocsIds.includes(document?.id)) {
      userDoc[downvotedDocs].pull(document?.id); // removed

      document.downvotes--;
      creator.karma++;
    }

    userDoc[upvotedDocs].push(document?.id);
    userDoc.save();
    document.upvotes++;
    document.save();
    creator.karma++;
    creator.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      document,
    },
  });
};

exports.downvoteDocument = Model => async (req, res, next) => {
  const document = await Model.findById(req.params.id);
  const user = req.user;

  if (!document) {
    throw new AppError('document not found', 404);
  }

  const userDoc = await User.findById(user?.id);
  const creator = await User.findById(document.creator);

  let upvotedDocs = 'upvotedDocs';
  let downvotedDocs = 'downvotedDocs';

  if (Model.modelName === 'Post') {
    upvotedDocs = 'upvotedPosts';
    downvotedDocs = 'downvotedPosts';
  } else if (Model.modelName === 'Comment') {
    upvotedDocs = 'upvotedComments';
    downvotedDocs = 'downvotedComments';
  } else if (Model.modelName === 'Reply') {
    upvotedDocs = 'upvotedReplies';
    downvotedDocs = 'downvotedReplies';
  }

  const upvotedDocsIds = userDoc[upvotedDocs].map(doc => doc._id.toString());
  const downvotedDocsIds = userDoc[downvotedDocs].map(doc =>
    doc._id.toString()
  );

  if (downvotedDocsIds.includes(document?.id)) {
    throw new AppError('You have already downvoted', 400);
  } else {
    if (upvotedDocsIds.includes(document?.id)) {
      userDoc[upvotedDocs].pull(document?.id); // removed

      document.upvotes--;
      creator.karma--;
    }

    userDoc[downvotedDocs].push(document?.id);
    userDoc.save();
    document.downvotes++;
    document.save();
    creator.karma--;
    creator.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      document,
    },
  });
};

exports.removeUpvote = Model => async (req, res, next) => {
  const document = await Model.findById(req.params.id);
  const user = req.user;

  if (!document) {
    throw new AppError('document not found', 404);
  }

  const userDoc = await User.findById(user?.id);
  const creator = await User.findById(document.creator);

  let upvotedDocs = 'upvotedDocs';
  let downvotedDocs = 'downvotedDocs';

  if (Model.modelName === 'Post') {
    upvotedDocs = 'upvotedPosts';
    downvotedDocs = 'downvotedPosts';
  } else if (Model.modelName === 'Comment') {
    upvotedDocs = 'upvotedComments';
    downvotedDocs = 'downvotedComments';
  } else if (Model.modelName === 'Reply') {
    upvotedDocs = 'upvotedReplies';
    downvotedDocs = 'downvotedReplies';
  }

  const upvotedDocsIds = userDoc[upvotedDocs].map(doc => doc._id.toString());
  const downvotedDocsIds = userDoc[downvotedDocs].map(doc =>
    doc._id.toString()
  );

  if (!upvotedDocsIds.includes(document?.id)) {
    throw new AppError('You have not upvoted', 400);
  } else {
    userDoc[upvotedDocs].pull(document?.id); // removed

    document.upvotes--;
    creator.karma--;
  }

  userDoc.save();
  document.save();
  creator.save();

  res.status(200).json({
    status: 'success',
    data: {
      document,
    },
  });
};

exports.removeDownvote = Model => async (req, res, next) => {
  const document = await Model.findById(req.params.id);
  const user = req.user;

  if (!document) {
    throw new AppError('document not found', 404);
  }

  const userDoc = await User.findById(user?.id);
  const creator = await User.findById(document.creator);

  let upvotedDocs = 'upvotedDocs';
  let downvotedDocs = 'downvotedDocs';

  if (Model.modelName === 'Post') {
    upvotedDocs = 'upvotedPosts';
    downvotedDocs = 'downvotedPosts';
  } else if (Model.modelName === 'Comment') {
    upvotedDocs = 'upvotedComments';
    downvotedDocs = 'downvotedComments';
  } else if (Model.modelName === 'Reply') {
    upvotedDocs = 'upvotedReplies';
    downvotedDocs = 'downvotedReplies';
  }

  const upvotedDocsIds = userDoc[upvotedDocs].map(doc => doc._id.toString());
  const downvotedDocsIds = userDoc[downvotedDocs].map(doc =>
    doc._id.toString()
  );

  if (!downvotedDocsIds.includes(document?.id)) {
    throw new AppError('You have not downvoted', 400);
  } else {
    userDoc[downvotedDocs].pull(document?.id); // removed

    document.downvotes--;
    creator.karma++;
  }

  userDoc.save();
  document.save();
  creator.save();

  res.status(200).json({
    status: 'success',
    data: {
      document,
    },
  });
};
