const logger = require('../utils/logger');

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           default: error
 *         message:
 *           type: string
 *           default: Something went very wrong!
 */

const sendErrorDev = (err, res) => {
  switch (err.name) {
    case 'CastError':
      res.status(404).json({
        status: err.status,
        message: 'Resource not found',
      });
      break;

    case 'ValidationError':
      res.status(400).json({
        status: err.status,
        message: 'Invalid data',
      });
      break;

    case 'MongoServerError':
      res.status(400).json({
        status: err.status,
        message: 'Invalid data',
      });
      break;

    case 'JsonWebTokenError':
      res.status(401).json({
        status: err.status,
        message: 'Invalid token',
      });
      break;

    case 'TokenExpiredError':
      res.status(401).json({
        status: err.status,
        message: 'Token expired',
      });
      break;

    default:
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
      });
      break;
  }
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    logger.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    const error = { ...err };
    sendErrorProd(error, res);
  }
};
