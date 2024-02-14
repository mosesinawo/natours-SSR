const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();
//1) Middleware

//GLOBAL MIDDLEWARES
//Set security http header
app.use(helmet());

//Developement logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit request from the same api
const limiter = rateLimit({
  max: 100,
  windowMss: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour',
});
app.use('/api', limiter);

//Body parser, reacding data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

//Prevent parameter polution of query string
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'price',
      'maxGroupSize',
    ],
  }),
);

//Serving static files
app.use(express.static(`${__dirname}/public`));

//Text middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello, world server! 🚀', app: 'Natours' });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl} on this server !`,
  //   });
  //   const err = new Error(`Can't find ${req.originalUrl} on this server !`);
  //   err.status = 'fail';
  //   err.statusCode = 404;
  //   next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server !`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

// app.get('/', (req, res) => {
// res.status(200)
// .json({message:'Hello, world server! 🚀', app:'Natours'});
// });
// app.post('/', (req, res) => {
// res.status(200)
// .json({message:'Hello, world server! 🚀', app:'Natours'});
// });
