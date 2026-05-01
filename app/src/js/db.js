const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("app/db/web-db.db");

// Create tables
db.serialize(async function() {

  db.run(
    "CREATE TABLE IF NOT EXISTS users(users_id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)",
    err => {
      if (err) {
        return console.log(err.message);
      }
    }
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS userDetails(users_id INTEGER PRIMARY KEY, username TEXT, ipAddress TEXT, userAgent TEXT)",
    err => {
      if (err) {
        return console.log(err.message);
      }
    }
  );

  // Secure bcrypt password hashes
  const adminPassword = await bcrypt.hash("jupiter", 10);
  const jordanPassword = await bcrypt.hash("nonyabusiness", 10);
  const chrisPassword = await bcrypt.hash("alsononyabusiness", 10);
  const hackmacPassword = await bcrypt.hash("gimmetheflag", 10);

  db.run(
    `INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`,
    ["admin", adminPassword]
  );

  db.run(
    `INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`,
    ["jordan", jordanPassword]
  );

  db.run(
    `INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`,
    ["chris", chrisPassword]
  );

  db.run(
    `INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`,
    ["hackmac", hackmacPassword]
  );

});

module.exports = db;