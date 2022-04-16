const cron = require('node-cron');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const Reply = require('../models/replyModel');
const logger = require('./../utils/logger');

function calculateCommentScore(comment) {
  const n = comment.upvotes + comment.downvotes;
  if (n === 0) {
    return 0;
  } else {
    const z = 1.281551565545;
    const p = comment.upvotes / n;

    const left = p + (1 / (2 * n)) * z * z;
    const right = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
    const under = 1 + (1 / n) * z * z;

    return (left - right) / under;
  }
}

module.exports = () =>
  cron.schedule('0 */15 * * * *', async function () {
    logger.info('Calculating score');

    // Calculate score based on Reddit's hot ranking algorithm (https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111e33d0d9)

    // Post ranking algorithm

    // 1. Get all posts posted 24 hours from now

    const posts = await Post.find({
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    // 2. For each post, calculate the score

    posts.forEach(async post => {
      const t = (Date.now() - post.createdAt) / 1000;
      const x = post.upvotes - post.downvotes;
      let y, z;
      if (x > 0) {
        y = 1;
      } else if (x < 0) {
        y = -1;
      } else {
        y = 0;
      }

      if (x >= 1) {
        z = x;
      } else {
        z = 1;
      }

      const score = Math.log10(z) + (y * t) / 45000;

      post.score = score;

      // 3. Update and save the post

      post.save();
    });

    // Comment ranking algorithm

    // 1. Get all comments posted 24 hours from now

    const comments = await Comment.find({
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    // 2. For each comment, calculate the score

    comments.forEach(async comment => {
      comment.score = calculateCommentScore(comment);

      // 3. Update and save the comment

      comment.save();
    });

    // Reply ranking algorithm

    // 1. Get all replies posted 24 hours from now

    const replies = await Reply.find({
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    // 2. For each reply, calculate the score

    replies.forEach(async reply => {
      reply.score = calculateCommentScore(reply);

      // 3. Update and save the reply

      reply.save();
    });
  });
