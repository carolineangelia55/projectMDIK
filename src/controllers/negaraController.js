const db = require('../models/db');

exports.getAllNegara = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id_negara, kode_negara, nama_negara FROM negara');
    res.json({ status:'success', data: rows });
  } catch (err) {
    res.status(500).json({ status:'error', message: err.message });
  }
};
