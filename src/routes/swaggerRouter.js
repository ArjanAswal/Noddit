const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./../swagger.js');

const specs = swaggerJsdoc(swaggerDocument);

const router = express.Router();

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs));

module.exports = router;
