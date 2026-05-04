const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const validator = require("validator");
const router = express.Router();
const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "security.log" })
  ]
});

// Import database
const db = require("../db.js");

router.post("/", function(request, response) {

  var username = validator.escape(request.body.username);
  var password = validator.escape(request.body.password);

  if (username && password) {

    console.log(`Username: ${username} Password: ${password}`);

    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (err, row) => {

        if (err) {
          response.send("Invalid username or password");
          return console.log(err.message);
        }

        if (row) {

          const match = await bcrypt.compare(password, row.password);

          if (match) {

            request.session.loggedin = true;
            request.session.username = username;

            // JWT token
            const token = jwt.sign(
              { username: username },
              "your-secret-key",
              { expiresIn: "1h" }
            );

            console.log("JWT Token:", token);

            addDetails(username, request.ip, request.headers["user-agent"]);

            logger.info(`Successful login from IP: ${request.ip}`);
            logger.info(`User-Agent: ${request.headers["user-agent"]}`);

            response.redirect("/home");

          } else {

            logger.warn(`Failed login attempt for username: ${username}`);
            response.send("Invalid username or password");

          }

        } else {

          logger.warn(`Failed login attempt for username: ${username}`);
          response.send("Invalid username or password");

        }

      }
    );

  } else {

    response.redirect("/");
    response.end();

  }

});

function addDetails(username, ipAddress, userAgent) {
  db.run(
    `INSERT INTO userDetails (username, ipAddress, userAgent) VALUES ('${username}', '${ipAddress}', '${userAgent}')`,
    err => {
      if (err) {
        return console.log(err.message);
      }
    }
  );
}

module.exports = router;
