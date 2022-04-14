const express = require('express');
const passport = require('passport');
const communityController = require('../controllers/communityController');

const router = express.Router();

router
  .route('/')
  .get(communityController.getCommunities)
  .post(
    passport.authenticate('jwt', { session: false }),
    communityController.createCommunity
  );

router
  .route('/:id')
  .get(communityController.getCommunity)
  .patch(
    passport.authenticate('jwt', { session: false }),
    communityController.updateCommunity
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    communityController.deleteCommunity
  );

router
  .route('/:id/ban')
  .patch(
    passport.authenticate('jwt', { session: false }),
    communityController.ban
  );
router
  .route('/:id/unban')
  .patch(
    passport.authenticate('jwt', { session: false }),
    communityController.unban
  );

module.exports = router;
