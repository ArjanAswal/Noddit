require('express-async-errors');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    status : 'success',
    data : {
      user,
    },
  });
};
