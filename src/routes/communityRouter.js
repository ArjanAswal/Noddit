const express = require('express');
const communityController = require('../controllers/communityController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(communityController.getCommunities)
  .post(protect, communityController.createCommunity);

router
  .route('/:id')
  .get(communityController.getCommunity)
  .patch(protect, communityController.updateCommunity)
  .delete(protect, communityController.deleteCommunity);

router.route('/:id/ban').patch(protect, communityController.ban);
router.route('/:id/unban').patch(protect, communityController.unban);

router.route('/:id/subscribe').patch(protect, communityController.subscribe);

router
  .route('/:id/unsubscribe')
  .patch(protect, communityController.unsubscribe);

module.exports = router;
