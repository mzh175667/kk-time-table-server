const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { DB_URL } = require("./config/index");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");
// const welcomeRoutes = require("./routes/api");
const cors = require("cors");
const { HTTP_STATUS } = require("./utils/constants");

const APP_PORT = process.env.PORT || 5000;

// App Config
const app = express();

// Middleware
global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
// app.use(welcomeRoutes);
app.use("/api", routes);
// app.use("/uploads", express.static("uploads"));
app.use(errorHandler);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Headers", "X-Requested-Width");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

// DB Config
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB connected successfully...");
});

mongoose.set("debug", true);

/** catch 404 and forward to error handler */
app.use("*", (req, res) => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    statusCode: HTTP_STATUS.NOT_FOUND,
    message: "API Endpoint Doesn't Exist",
  });
});

// App Listener
app.listen(APP_PORT, () => {
  console.log(`Listening on port ${APP_PORT}`);
});
