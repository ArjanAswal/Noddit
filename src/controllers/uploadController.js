require('express-async-errors');
const AWS = require('aws-sdk');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

exports.upload = async (req, res) => {

  if (!process.env.AWS_S3_ACCESS_KEY_ID || !process.env.AWS_S3_SECRET_ACCESS_KEY) {
    return this.uploadLocal(req, res);
  }

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

exports.uploadLocal = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { fileExtension, fileName, fileData } = req.body;

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!fileExtension || !fileName) {
    throw new AppError('fileName or fileExtension missing', 400);
  }

  if (!fileData) {
    throw new AppError('No file data provided', 400);
  }

  // Create directory structure
  const uploadsDir = path.join(__dirname, '../../uploads');
  const userDir = path.join(uploadsDir, user._id.toString(), fileName.trim());

  // Create directories recursively if they don't exist
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  // Generate unique filename
  const uniqueFileName = `${uuid()}.${fileExtension.trim()}`;
  const filePath = path.join(userDir, uniqueFileName);

  // Save file to local storage
  const buffer = Buffer.from(fileData, 'base64');
  fs.writeFileSync(filePath, buffer);

  // Return the path information
  const relativePath = path.join(
    user._id.toString(),
    fileName.trim(),
    uniqueFileName
  );

  res.status(200).json({
    status: 'success',
    data: {
      key: relativePath,
      path: filePath,
    },
  });
};