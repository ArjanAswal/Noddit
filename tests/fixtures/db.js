const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/userModel');

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  username: 'test_01',
  email: '01@test.com',
  password: 'test_001231',
  token: jwt.sign({ userOneId }, process.env.JWT_SECRET ?? 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN ?? 90,
  }),
};

const userTwo = {
  _id: userTwoId,
  username: 'test_01',
  email: '02@test.com',
  password: 'test_001232',
  token: jwt.sign({ userTwoId }, process.env.JWT_SECRET ?? 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN ?? 90,
  }),
};

const setupDatabase = async () => {
  await User.deleteMany();
  await User.create(userOne);
  await User.create(userTwo);
};

module.exports = {
  userOne,
  userTwo,
  setupDatabase,
};
