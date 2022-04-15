const User = require('../models/userModel');
const Community = require('../models/communityModel');
const AppError = require('../utils/appError');
const { getDocuments, getDocument } = require('../controllers/handlerFactory');

exports.getCommunities = getDocuments(Community);

exports.getCommunity = getDocument(Community);

exports.createCommunity = async (req, res, next) => {
  const {
    name,
    moderators,
    bannedUsers,
    rules,
    avatar,
    cover,
    description,
    welcomeMessage,
    userFlairs,
    postFlairs,
  } = req.body;

  if (name.match(/^\w+$/) === null) {
    throw new AppError(
      'Community name can only contain letters, numbers and underscores',
      400
    );
  }

  const user = req.user;

  const subCreatorDoc = await User.findById(user.id).select('karma');

  if (subCreatorDoc?.karma < 49) {
    throw new AppError('You need at least 50 karma to create a community', 400);
  }
  // Remove duplicates and add the creator to the list
  const mods = moderators
    ? [...new Set(moderators.push(user?.id))]
    : [user?.id];

  const community = await Community.create({
    name,
    creator: user.id,
    moderators: mods,
    bannedUsers,
    rules,
    avatar,
    cover,
    description,
    welcomeMessage,
    userFlairs,
    postFlairs,
  });

  res.status(201).json({
    status: 'success',
    data: {
      community,
    },
  });
};

exports.updateCommunity = async (req, res, next) => {
  const {
    name,
    moderators,
    bannedUsers,
    rules,
    avatar,
    cover,
    description,
    welcomeMessage,
    userFlairs,
    postFlairs,
  } = req.body;

  const user = req.user;

  const community = await Community.findById(req.params.id);

  if (!community) {
    throw new AppError('Community does not exist', 400);
  }
  if (community?.creator?._id.toString() !== user.id) {
    throw new AppError('You are not the creator of this community', 400);
  }

  // Remove duplicates and add the creator to the list
  const mods = moderators
    ? [...new Set(moderators.push(user?.id))]
    : [user?.id];

  const newCommunity = await Community.updateOne(
    { id: req.params.id },
    {
      name,
      moderators: mods,
      bannedUsers,
      rules,
      avatar,
      cover,
      description,
      welcomeMessage,
      userFlairs,
      postFlairs,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      community: newCommunity,
    },
  });
};

exports.deleteCommunity = async (req, res, next) => {
  const community = await Community.findById(req.params.id);

  if (!community) {
    throw new AppError('Community not found', 404);
  }

  const user = req.user;

  if (community.creator !== user?.id && user.role !== 'admin') {
    throw new AppError(
      'You are not the creator of this community nor the Admin',
      403
    );
  }

  await community.remove();

  res.status(200).json({
    status: 'success',
    data: null,
  });
};

exports.ban = async (req, res, next) => {
  const community = await Community.findById(req.params.id);
  const user = await User.findById(req.body.user);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!community) {
    throw new AppError('Community not found', 404);
  }

  const bannedUsers = community?.bannedUsers?.map(userId => userId.toString());

  if (bannedUsers?.includes(req.body.user)) {
    throw new AppError('User is already banned from this community', 400);
  }

  community?.bannedUsers?.push(user._id);
  await community.save();

  res.status(200).json({
    status: 'success',
    data: {
      community,
    },
  });
};

exports.unban = async (req, res, next) => {
  const community = await Community.findById(req.params.id);
  const user = await User.findById(req.body.user);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!community) {
    throw new AppError('Community not found', 404);
  }

  const bannedUsers = community?.bannedUsers?.map(userId => userId.toString());

  if (bannedUsers?.includes(req.body.user)) {
    community['bannedUsers'] = bannedUsers?.filter(
      userId => userId !== req.body.user
    );
  } else {
    throw new AppError('User is not banned from this community', 400);
  }

  await community.save();

  res.status(200).json({
    status: 'success',
    data: {
      community,
    },
  });
};

exports.subscribe = async (req, res, next) => {
  const community = await Community.findById(req.params.id);

  if (!community) {
    throw new AppError('Community not found', 404);
  }

  const user = await User.findById(req.user.id);

  const subscribedCommunities = user.subscribedCommunities.map(community =>
    community._id.toString()
  );

  if (subscribedCommunities?.includes(community._id.toString())) {
    throw new AppError('User is already subscribed to this community', 400);
  }

  user.subscribedCommunities.push(community._id);
  await user.save();

  community.subscribers++;

  community.save();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.unsubscribe = async (req, res, next) => {
  const community = await Community.findById(req.params.id);

  if (!community) {
    throw new AppError('Community not found', 404);
  }

  const user = await User.findById(req.user.id);

  const subscribedCommunities = user.subscribedCommunities.map(community =>
    community._id.toString()
  );

  if (!subscribedCommunities?.includes(community._id.toString())) {
    throw new AppError('User not subscribed to this community', 400);
  }

  user.subscribedCommunities.pull(community._id);
  await user.save();

  community.subscribers--;

  community.save();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};
