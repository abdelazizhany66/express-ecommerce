const path = require('path');

const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: 'config.env' });
const APIError = require('./src/utils/apiError');
const connectDB = require('./src/config/connect-db');
const globalError = require('./src/middleware/error-middleware');
//routes
const mountRoute = require('./src/routes');

//connect DB
connectDB();

const app = express();

//middlewares
app.use(express.json());
//serve folder
app.use(express.static(path.join(__dirname, 'uploads')));

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
