const db = require('../models/db');

exports.getAllTopik = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id_topik, nama_topik FROM topik');
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
