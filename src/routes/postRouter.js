const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();
const { protect } = require('../controllers/authController');

/**
 * @swagger
 * tags:
 * - name: Post
 *   description: API for Posts
 */

/**
 * @swagger
 * "/posts":
 *   get:
 *     tags:
 *     - Post
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
 *     - name: page
 *       in: query
 *       description: Number of pages
 *       type: number
 *     - name: creator
 *       in: query
 *       description: The creator of the community
 *       type: string
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
 *   post:
 *     tags:
 *     - Post
 *	    security:
 *	     - jwt: []
 *     description: Create a new post
 *     produces:
 *     - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             "$ref": "#/components/schemas/Post"
 *           example:
 *             title: "Post title"
 *             description: "Post content"
 *             mediaURLs: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"]
 *             community: "62615a40ccf652ba08b81b10"
 *       required: true
 *     responses:
 *       '201':
 *         description: Returns the created post
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Post"
 *       '401':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Error"
 *             example:
 *               status: fail
 *               message: Unauthorized
 */

router
  .route('/')
  .get(postController.getPosts)
  .post(protect, postController.createPost);

/**
 * @swagger
 * "/posts/feed":
 *   get:
 *     tags:
 *     - Post
 *	    security:
 *	     - jwt: []
 *     description: Get User feed
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
 *       '401':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Error"
 *             example:
 *               status: fail
 *               message: Unauthorized
 */

router.route('/feed').get(protect, postController.getFeed);

/**
 * @swagger
 * "/posts/{id}":
 *   get:
 *     tags:
 *     - Post
 *     description: Get a specific post
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the post
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the post
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Post"
 *       '404':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Error"
 *             example:
 *               status: error
 *               message: Resource not found
 *   delete:
 *     tags:
 *     - Post
 *	    security:
 *	     - jwt: []
 *     description: Delete a specific post
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the post
 *       type: string
 *       required: true
 *     responses:
 *       '204':
 *         description: Returns no content
 *       '401':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Error"
 *             example:
 *               status: fail
 *               message: Unauthorized
 */

router
  .route('/:id')
  .get(postController.getPost)
  .delete(protect, postController.deletePost);

/**
 * @swagger
 * "/posts/{id}/upvote":
 *   post:
 *     tags:
 *     - Post
 *	    security:
 *	     - jwt: []
 *     description: Upvote a post
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the post
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the upvoted post
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Post"
 *       '401':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Error"
 *             example:
 *               status: fail
 *               message: Unauthorized
 *   delete:
 *     tags:
 *     - Post
 *	    security:
 *	     - jwt: []
 *     description: Remove an upvote from a specific post
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the post
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the post
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Post"
 *       '401':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Error"
 *             example:
 *               status: fail
 *               message: Unauthorized
 */

router
  .route('/:id/upvote')
  .post(protect, postController.upvotePost)
  .delete(protect, postController.removeUpvote);

/**
 * @swagger
 * "/posts/{id}/downvote":
 *   post:
 *     tags:
 *     - Post
 *	    security:
 *	     - jwt: []
 *     description: Downvote a post
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the post
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the downvoted post
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Post"
 *       '401':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Error"
 *             example:
 *               status: fail
 *               message: Unauthorized
 *   delete:
 *     tags:
 *     - Post
 *	    security:
 *	     - jwt: []
 *     description: Remove a downvote from a specific post
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the post
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the post
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Post"
 *       '401':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Error"
 *             example:
 *               status: fail
 *               message: Unauthorized
 */

router
  .route('/:id/downvote')
  .post(protect, postController.downvotePost)
  .delete(protect, postController.removeDownvote);

module.exports = router;
