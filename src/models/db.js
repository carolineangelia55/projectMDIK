const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
<<<<<<< HEAD:src/models/db.js
  database: 'db_mdik',
=======
  database: 'db_tugasmdik',
>>>>>>> 2402e58d57b77e8029f8676797acdd858dac473f:db.js
  waitForConnections: true,
  connectionLimit: 10000,
  queueLimit: 10000
});

module.exports = db;
