const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

// Create tables if not exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Category (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS Product (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT,
    price REAL,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
  )`);
});

module.exports = db;
