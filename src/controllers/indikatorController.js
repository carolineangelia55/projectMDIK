const db = require('../models/db');

exports.getIndikatorByTopik = async (req, res) => {
  const { id_topik } = req.params;
  try {
    const sql = `
      SELECT id_indikator, kode_indikator, nama_indikator
      FROM indikator
      WHERE id_topik = $1`;
    const { rows } = await db.query(sql, [id_topik]);
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
