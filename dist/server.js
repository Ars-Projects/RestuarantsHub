const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const app = express();
//Body parser
app.use(express.json());
//dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`Server running on ${process.env.NODE_ENV} mode on ${PORT}`);
});
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err}`);
    server.close(() => process.exit(1));
});
process;
//# sourceMappingURL=server.js.map