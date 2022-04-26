require('express-async-errors');
const AWS = require('aws-sdk');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { v4: uuid } = require('uuid');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

exports.upload = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { fileExtension, fileName } = req.body;

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!fileExtension || !fileName) {
    throw new AppError('fileName or fileExtension missing', 400);
  }

  const key = `${
    user._id
  }/${fileName.trim()}/${uuid()}.${fileExtension.trim()}`;

  let signedUrl = s3.getSignedUrl('putObject', {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: fileExtension,
    Expires: 300,
  });

  res.status(200).json({
    status: 'success',
    data: {
      key,
      signedUrl,
    },
  });
};
