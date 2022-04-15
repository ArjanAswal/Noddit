const express = require('express');
const passport = require('passport');
require('express-async-errors');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
require('./../controllers/passportController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  authController.signin
);

router.get('/signout', authController.signout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  passport.authenticate('jwt', { session: false }),
  authController.updatePassword
);

router.route('/:id').get(userController.getUser);

module.exports = router;
