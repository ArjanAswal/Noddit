const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();
const { protect } = require('../controllers/authController');

/**
 * @swagger
 * tags:
 * - name: Posts
 *   description: API for Posts
 */

/**
 * @swagger
 * "/posts":
 *   get:
 *     tags:
 *     - Posts
 *     description: Get posts
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: sort
 *       in: query
 *       description: How to sort the posts
 *       type: string
 *     - name: limit
 *       in: query
 *       description: How many posts to return
 *       type: number
 *     responses:
 *       '200':
 *         description: Returns the posts
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Posts"
 *       '500':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Error"
 *             example:
 *               status: error
 *               message: Something went very wrong!
 */

router
  .route('/')
  .get(postController.getPosts)
  .post(protect, postController.createPost);

router.route('/feed').get(protect, postController.getFeed);

router
  .route('/:id')
  .get(postController.getPost)
  .delete(protect, postController.deletePost);

router
  .route('/:id/upvote')
  .post(protect, postController.upvotePost)
  .delete(protect, postController.removeUpvote);

router
  .route('/:id/downvote')
  .post(protect, postController.downvotePost)
  .delete(protect, postController.removeDownvote);

module.exports = router;
