const express = require('express');
const passport = require('passport');
require('express-async-errors');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const { protect } = require('../controllers/authController');
require('./../controllers/passportController');

const router = express.Router();

/**
 * @swagger
 * tags:
 * - name: User
 *   description: API for Users
 */

/**
 * @swagger
 * "/users/signup":
 *   post:
 *     tags:
 *     - User
 *     description: Sign up a new user
 *     produces:
 *     - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             "$ref": "#/components/schemas/User"
 *           example:
 *             username: "user_123"
 *             email: "user@example.com"
 *             password: "noddit123"
 *       required: true
 *     responses:
 *       '201':
 *         description: Returns the created user
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/User"
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

router.post('/signup', authController.signup);

/**
 * @swagger
 * "/users/signin":
 *   post:
 *     tags:
 *     - User
 *     description: Sign in a user
 *     produces:
 *     - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             "$ref": "#/components/schemas/User"
 *           example:
 *             email: "user@example.com"
 *             password: "noddit123"
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the user
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/User"
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

router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  authController.signin
);

/**
 * @swagger
 * "/users/signout":
 *   get:
 *     tags:
 *     - User
 *     description: Sign out a user
 *     produces:
 *     - application/json
 *     responses:
 *       '200':
 *         description: Success
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

router.get('/signout', authController.signout);

/**
 * @swagger
 * "/users/forgotPassword":
 *   post:
 *     tags:
 *     - User
 *     description: Forgot password route
 *     produces:
 *     - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             "$ref": "#/components/schemas/User"
 *           example:
 *             email: "user@example.com"
 *       required: true
 *     responses:
 *       '200':
 *         description: Email the token to reset password
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

router.post('/forgotPassword', authController.forgotPassword);

/**
 * @swagger
 * "/users/resetPassword/{token}":
 *   patch:
 *     tags:
 *     - User
 *     description: Resets the password
 *     produces:
 *     - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             password: "noddit_123"
 *       required: true
 *     parameters:
 *     - name: token
 *       in: path
 *       description: Token to reset password
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Resets the password
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

router.patch('/resetPassword/:token', authController.resetPassword);

/**
 * @swagger
 * "/users/updatePassword/":
 *   patch:
 *     tags:
 *     - User
 *	    security:
 *	     - jwt: []
 *     description: Updates the password
 *     produces:
 *     - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             currentPassword: "noddit_123"
 *             password: "noddit_1234"
 *       required: true
 *     responses:
 *       '200':
 *         description: Updates the password
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

router.patch('/updatePassword', protect, authController.updatePassword);

/**
 * @swagger
 * "/users/{id}":
 *   get:
 *     tags:
 *     - User
 *     description: Get a specific user
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Unique id of the user
 *       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Returns the user
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/User"
 *       '404':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/Error"
 *             example:
 *               status: error
 *               message: Resource not found
 */

router.route('/:id').get(userController.getUser);

module.exports = router;
