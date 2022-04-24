const express = require('express');
const communityController = require('../controllers/communityController');
const {protect} = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 * - name: Community
 *   description: API for Communities
 */

/**
 * @swagger
 * "/communities":
 *   get:
 *     tags:
 *     - Community
 *     description: Get communities
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: sort
 *       in: query
 *       description: How to sort the communities
 *       type: string
 *     - name: limit
 *       in: query
 *       description: How many communities to return
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
 *         description: Returns the communities
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Communities"
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
 *     - Community
 *	    security:
 *	     - jwt: []
 *     description: Create a new community
 *     produces:
 *     - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             "$ref": "#/components/schemas/Community"
 *           example:
 *             name: "Community_title"
 *             description: "Community description"
 *       required: true
 *     responses:
 *       '201':
 *         description: Returns the created community
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Community"
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
    .get(communityController.getCommunities)
    .post(protect, communityController.createCommunity);

/**
 * @swagger
 * "/communities/{id}":
 *   get:
 *     tags:
 *     - Community
 *     description: Get a specific community
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the community
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the community
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Community"
 *       '404':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Error"
 *             example:
 *               status: error
 *               message: Resource not found
 *   patch:
 *     tags:
 *     - Community
 *	    security:
 *	     - jwt: []
 *     description: Updates a specific community
 *     produces:
 *     - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             "$ref": "#/components/schemas/Community"
 *           example:
 *             name: "Community_title"
 *             description: "Community description"
 *       required: true
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the community
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the community
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Community"
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
 *     - Community
 *	    security:
 *	     - jwt: []
 *     description: Delete a specific community
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the community
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
    .get(communityController.getCommunity)
    .patch(protect, communityController.updateCommunity)
    .delete(protect, communityController.deleteCommunity);

/**
 * @swagger
 * "/communities/{id}/ban":
 *   patch:
 *     tags:
 *     - Community
 *	    security:
 *	     - jwt: []
 *     description: Bans a specific user
 *     produces:
 *     - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             user: "62555a59c5552e21245d4338"
 *       required: true
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the community
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the community
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Community"
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

router.route('/:id/ban').patch(protect, communityController.ban);

/**
 * @swagger
 * "/communities/{id}/unban":
 *   patch:
 *     tags:
 *     - Community
 *	    security:
 *	     - jwt: []
 *     description: Unbans a specific user
 *     produces:
 *     - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             user: "62555a59c5552e21245d4338"
 *       required: true
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the community
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the community
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Community"
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

router.route('/:id/unban').patch(protect, communityController.unban);

/**
 * @swagger
 * "/communities/{id}/subscribe":
 *   patch:
 *     tags:
 *     - Community
 *	    security:
 *	     - jwt: []
 *     description: Subscribes to a specific community
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the community
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the community
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Community"
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

router.route('/:id/subscribe').patch(protect, communityController.subscribe);

/**
 * @swagger
 * "/communities/{id}/unsubscribe":
 *   patch:
 *     tags:
 *     - Community
 *	    security:
 *	     - jwt: []
 *     description: Unsubscribes from a specific community
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the community
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the community
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Community"
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

router.route('/:id/unsubscribe')
    .patch(protect, communityController.unsubscribe);

module.exports = router;
