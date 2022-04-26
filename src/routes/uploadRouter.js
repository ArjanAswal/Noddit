const express = require('express');
const uploadController = require('../controllers/uploadController');
const router = express.Router();
const { protect } = require('../controllers/authController');

router.route('/').post(protect, uploadController.upload);

module.exports = router;
