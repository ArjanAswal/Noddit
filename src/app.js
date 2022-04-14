const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
require('express-async-errors');
const healthcheckRouter = require('./routes/healthcheckRouter');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Side effect import
require('./controllers/passportController');

const app = express();

app.use(passport.initialize());

// Global Middlewares
// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);

app.use('/healthz', healthcheckRouter);

app.all('*', req => {
  throw new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
});

app.use(globalErrorHandler);

module.exports = app;
