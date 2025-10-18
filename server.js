const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');


dotenv.config({ path: 'config.env' });
const APIError = require('./src/utils/apiError');
const connectDB = require('./src/config/connect-db');
const globalError = require('./src/middleware/error-middleware');
//routes
const mountRoute = require('./src/routes');
const { webhochCheckout } = require('./src/services/orderService');

//connect DB
connectDB();

const app = express();

//enable to other domains access to aplication
app.use(cors());

// compress responses
app.use(compression());
app.use(mongoSanitize());


app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhochCheckout
);

//middlewares     fixing a request size limit for all requests
app.use(express.json({ limit: '20kb' }));
//serve folder
app.use(express.static(path.join(__dirname, 'uploads')));

// Limit each IP to 100 requests per `window` (here, per 15 minutes).
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
});

// Apply the rate limiting middleware to all requests.
app.use('/api', limiter);

app.use(
  hpp({
    whitelist: ['price', 'sold', 'ratingQuantity', 'quantity', 'ratingAvarage'],
  })
);

//routes
mountRoute(app);

// if client send req to other route not exist
app.use((req, res, next) => {
  // const err = new Error(`can't find this route ${req.originalUrl}`)
  next(new APIError(`can't find this route ${req.originalUrl}`, 404));
});

//global error handler middleware
app.use(globalError);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`server is run in port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`unhandledRejection Error : ${err.name} | ${err.message}`);

  server.close(() => {
    console.error('Shutting Down... ');
    process.exit(1);
  });
});
