const express = require('express');
const postController = require('../controllers/postController');
const passport = require('passport');
const router = express.Router();

/**
 * @swagger
 * "tags": [
 *    {
 *     "name": "Posts",
 *     "description": "API for Posts"
 *    }
 *  ]
 */

/**
 * @swagger
 * "definitions": {
 *   "Post": {
 *     "required": ["name", "_id", "companies"],
 *     "properties": {
 *       "_id": {
 *         "type": "integer",
 *         "uniqueItems": true
 *       },
 *       "isPublic": {
 *         "type": "boolean"
 *       },
 *       "name": {
 *         "type": "string"
 *       },
 *       "books": {
 *         "type": "array",
 *         "items": {
 *           "type": "object",
 *           "properties": {
 *             "name": {
 *               "type": "string"
 *             },
 *             "amount": {
 *               "type": "number"
 *             }
 *           }
 *         }
 *       },
 *       "companies": {
 *         "type": "array",
 *         "items": {
 *           "type": "string"
 *         }
 *       }
 *     }
 *   },
 *   "Posts": {
 *     "type": "array",
 *     "$ref": "#/definitions/Post"
 *   }
 * }
 */

/**
 * @swagger
 * "/posts": {
 *      "get": {
 *         "tags": ["Posts"],
 *           "description": "Get posts",
 *           "responses": {
 *               "200": {
 *                   "description": "Returns the posts",
 *                   "content": {
 *                       "application/json": {
 *                          "$ref": "#/definitions/Posts"
 *                      }
 *                  }
 *              }
 *          }
 *      }
 *  }
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
