const app = require('./app');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const calculateScore = require('./jobs/calculateScore');

process.on('uncaughtException', err => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

mongoose.connect(process.env.MONGO_URL).then(() => {
  logger.info('DB connection successful!');
  // Schedule cron job
  calculateScore();
});

const port = process.env.PORT ?? 3000;
const server = app.listen(port, () => {
  logger.info(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint() {
  logger.info('👋 SIGINT RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});

// quit properly on docker stop
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});
