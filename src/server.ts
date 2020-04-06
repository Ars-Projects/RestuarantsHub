const fs = require('fs');
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require('colors');
const fileupload = require('express-fileupload');
const connectDB = require("../config/db");
const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;
const jsYaml = require('js-yaml');

//Load env vars
dotenv.config({ path: "./config/config.env" });

connectDB();

//Route files
const restuarents = require("../dist/route/restuarents");
const menus = require("../dist/route/menus");
const orders = require('../dist/route/orders');
const users = require('../dist/route/users');

const app = express();

//Body parser
app.use(express.json());


//dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//File uploading
app.use(fileupload());


new OpenApiValidator({
  apiSpec: '/home/ajay/Restuarants/_data/openapispec.yaml',
  validateResponses: false, // <-- to validate responses
  validateRequests: false
  // unknownFormats: ['my-format'] // <-- to provide custom formats
})
  .install(app)
  .then(() => {

//Mount Routers
app.use("/api/v1/restuarents",restuarents);
app.use("/api/v1/menus", menus);
// app.use("/api/v2/menus", menus);
app.use('/api/v1/orders', orders);
app.use('/api/v1/users', users);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      name: err.name,
      message: err.message,
      data: err.data
    }
  });
});

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running on ${process.env.NODE_ENV} mode on ${PORT}`);
});

// process.on("unhandledRejection", (err, promise) => {
//   console.log(`Error: ${err}`);
//   server.close(() => process.exit(1));
// });

// process.on('SIGTERM', () => {
//   console.info('SIGTERM signal received.');
//   console.log('Closing http server.');
//   server.close(() => {
//     console.log('Http server closed.');
//   });
// });

process;
