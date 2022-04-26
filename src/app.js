const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');
const compression = require('compression');

require('express-async-errors');
const healthcheckRouter = require('./routes/healthcheckRouter');
const uploadRouter = require('./routes/uploadRouter');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const commentRouter = require('./routes/commentRouter');
const communityRouter = require('./routes/communityRouter');
const swaggerRouter = require('./routes/swaggerRouter');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Side effect import
require('./controllers/passportController');

const app = express();

app.enable('trust proxy');

// Global Middlewares
app.use(passport.initialize());

// Implement Cors
app.use(cors());
app.options('*', cors());

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['sort'],
  })
);

app.use(compression());

// Routes

// Swagger Docs
app.use('/', swaggerRouter);

// Healthcheck
app.use('/healthz', healthcheckRouter);

// App Routes

app.use('/api/v1/upload', uploadRouter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/communities', communityRouter);

app.all('*', (req) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
});

app.use(globalErrorHandler);

module.exports = app;
