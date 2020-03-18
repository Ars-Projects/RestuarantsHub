const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const app = express();

//Body parser
app.use(express.json());

//Load env vars
dotenv.config({ path: "./config/config.env" });

//dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("The sedulous hyena ate the antelope!");
});

const server = app.listen(PORT, () => {
  console.log(`Server running on ${process.env.NODE_ENV} mode on ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err}`);
  server.close(() => process.exit(1));
});

process;
