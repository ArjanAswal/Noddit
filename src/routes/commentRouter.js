const express = require('express');
const commentController = require('../controllers/commentController');
const {protect} = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 * - name: Comment
 *   description: API for Comments
 */

/**
 * @swagger
 * "/comments":
 *   get:
 *     tags:
 *     - Comment
 *     description: Get comments
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: sort
 *       in: query
 *       description: How to sort the comments
 *       type: string
 *     - name: limit
 *       in: query
 *       description: How many comments to return
 *       type: number
 *     - name: page
 *       in: query
 *       description: Number of pages
 *       type: number
 *     - name: creator
 *       in: query
 *       description: The creator of the comment
 *       type: string
 *     - name: parent
 *       in: query
 *       description: The parent of the comment
 *       type: string
 *     responses:
 *       '200':
 *         description: Returns the comments
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Comments"
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
 *     - Comment
 *	    security:
 *	     - jwt: []
 *     description: Create a new comment
 *     produces:
 *     - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             "$ref": "#/components/schemas/Comment"
 *           example:
 *             parent: "62654aeeeaa1f2b4ce930afa"
 *             content: "Comment content"
 *       required: true
 *     responses:
 *       '201':
 *         description: Returns the created comment
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Comment"
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

router.route('/')
    .get(commentController.getComments)
    .post(protect, commentController.createComment);

/**
 * @swagger
 * "/comments/{id}":
 *   get:
 *     tags:
 *     - Comment
 *     description: Get a specific comment
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the comment
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the comment
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Comment"
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
 *     - Comment
 *	    security:
 *	     - jwt: []
 *     description: Delete a specific comment
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the comment
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

router.route('/:id')
    .get(commentController.getComment)
    .delete(protect, commentController.deleteComment);

/**
 * @swagger
 * "/comments/{id}/upvote":
 *   post:
 *     tags:
 *     - Comment
 *	    security:
 *	     - jwt: []
 *     description: Upvote a comment
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the comment
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the upvoted comment
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Comment"
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
 *     - Comment
 *	    security:
 *	     - jwt: []
 *     description: Remove an upvote from a specific comment
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the comment
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the comment
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Comment"
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

router.route('/:id/upvote')
    .post(protect, commentController.upvoteComment)
    .delete(protect, commentController.removeUpvote);

/**
 * @swagger
 * "/comments/{id}/downvote":
 *   post:
 *     tags:
 *     - Comment
 *	    security:
 *	     - jwt: []
 *     description: Downvote a comment
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the comment
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the downvoted comment
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Comment"
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
 *     - Comment
 *	    security:
 *	     - jwt: []
 *     description: Remove a downvote from a specific comment
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the comment
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the comment
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Comment"
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

router.route('/:id/downvote')
    .post(protect, commentController.downvoteComment)
    .delete(protect, commentController.removeDownvote);

module.exports = router;
