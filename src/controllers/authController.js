const jwt = require('jsonwebtoken');
require('express-async-errors');
const User = require('../models/userModel');
const Email = require('../utils/email');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET ?? 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        +(process.env.JWT_COOKIE_EXPIRES_IN ?? '90') * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  delete user.password;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (username.match(/^\w+$/) === null) {
    throw new AppError(
      'Username can only contain letters, numbers and underscores',
      400
    );
  }
  const newUser = await User.create({ username, email, password });

  const url = `${req.protocol}://${req.get('host')}/me`;
  new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
};

exports.signin = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select('+password');
  createSendToken(user, 201, res);
};
