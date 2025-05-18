const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_mdik',
  waitForConnections: true,
  connectionLimit: 10000,
  queueLimit: 10000
});

module.exports = db;
