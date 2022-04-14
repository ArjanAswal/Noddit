const express = require('express');
const healthcheckController = require('../controllers/healthcheckController');

const router = express.Router();

router.route('/').get(healthcheckController.healthz);

module.exports = router;
