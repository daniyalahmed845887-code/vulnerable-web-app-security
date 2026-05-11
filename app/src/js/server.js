"use strict";

require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "security.log" })
  ]
});

// Initialise app and router
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many requests from this IP, please try again later."
});
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })
);
app.use(limiter);

app.use(cors({
  origin: "http://localhost:8080"
}));

// Constants
const HOST = process.env.HOST;
const PORT = process.env.PORT;

// Middlware
app.use(
  session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "strict"
  }
})
);
app.enable("trust proxy");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

// Routes
const login = require("./routes/login.js");
const home = require("./routes/home.js");
const upload = require("./routes/upload.js");
const uploads = require("./routes/uploads.js");
const auth = require("./routes/auth.js");

app.use(express.static(path.join(__dirname + "/../public")));

console.log(path.join(__dirname + "/../public"));

app.use("/", login);
app.use("/home", home);
app.use("/upload", upload);
app.use("/uploads/*", uploads);
app.use("/auth", auth);

app.listen(PORT, HOST);

logger.info(`Application started on http://${HOST}:${PORT}`);
