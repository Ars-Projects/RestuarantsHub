const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require('colors');
const connectDB = require("../config/db");
//Load env vars
dotenv.config({ path: "./config/config.env" });
connectDB();
//Route files
const restuarents = require("../dist/route/restuarents");
const menus = require("../dist/route/menus");
const app = express();
//Body parser
app.use(express.json());
//dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
//Mount Routers
app.use("/api/v1/restuarents", restuarents);
const PORT = process.env.PORT || 4000;
// app.get("/", (req, res) => {
//   res.send("The sedulous hyena ate the antelope!");
// });
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
//# sourceMappingURL=server.js.map