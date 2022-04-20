const express = require('express');
const postController = require('../controllers/postController');
const passport = require('passport');
const router = express.Router();

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
  .post(
    passport.authenticate('jwt', { session: false }),
    postController.createPost
  );

router
  .route('/feed')
  .get(
    passport.authenticate('jwt', { session: false }),
    postController.getFeed
  );

router
  .route('/:id')
  .get(postController.getPost)
  .delete(
    passport.authenticate('jwt', { session: false }),
    postController.deletePost
  );

router
  .route('/:id/upvote')
  .post(
    passport.authenticate('jwt', { session: false }),
    postController.upvotePost
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    postController.removeUpvote
  );

router
  .route('/:id/downvote')
  .post(
    passport.authenticate('jwt', { session: false }),
    postController.downvotePost
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    postController.removeDownvote
  );

module.exports = router;
