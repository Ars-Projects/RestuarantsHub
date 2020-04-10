const fs = require('fs');
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('../dist/middleware/error');
const connectDB = require("../config/db");
const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;
const jsYaml = require('js-yaml');

//Load env vars
dotenv.config({ path: "./config/config.env" });

connectDB();

//Route files
const restuarants = require("../dist/route/restuarants");
const menus = require("../dist/route/menus");
const orders = require('../dist/route/orders');
const users = require('../dist/route/users');
const auth = require('../dist/route/auth');

const app = express();

//Body parser
app.use(express.json());


//cookie parser
app.use(cookieParser());

//dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//File uploading
app.use(fileupload());

//Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname, "/public")));

new OpenApiValidator({
  apiSpec: '/home/ajay/RestuarantsHub/_data/openapispec.yaml',
  validateResponses: false, // <-- to validate responses
  validateRequests: false
  // unknownFormats: ['my-format'] // <-- to provide custom formats
})
  .install(app)
  .then(() => {

//Mount Routers
app.use("/api/v1/restuarants",restuarants);
app.use("/api/v1/menus", menus);
// app.use("/api/v2/menus", menus);
app.use('/api/v1/orders', orders);
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

});



// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   res.status(statusCode).json({
//     error: {
//       name: err.name,
//       message: err.message,
//       data: err.data
//     }
//   });
// });



const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running on ${process.env.NODE_ENV} mode on ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err}`);
  server.close(() => process.exit(1));
});

process;
