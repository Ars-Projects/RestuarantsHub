var express = require("express");
var dotenv = require("dotenv");
var morgan = require("morgan");
var app = express();
//Body parser
app.use(express.json());
//dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
var PORT = process.env.PORT || 4000;
app.get("/", function (req, res) {
    res.send("The sedulous hyena ate the antelope!");
});
var server = app.listen(PORT, function () {
    console.log("Server running on " + process.env.NODE_ENV + " mode on " + PORT);
});
process.on("unhandledRejection", function (err, promise) {
    console.log("Error: " + err);
    server.close(function () { return process.exit(1); });
});
process;
