const db = require('../models/db');

exports.listStatistik = async (req, res) => {
  let {
    page = 1,
    limit = 20,
    id_indikator,
    id_negara,
    tahun,
    sort = 'tahun',
    order = 'asc'
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const filters = [];
  const vals = [];

  if (id_indikator) {
    filters.push('s.id_indikator = ?');
    vals.push(id_indikator);
  }
  if (id_negara) {
    filters.push('s.id_negara = ?');
    vals.push(id_negara);
  }
  if (tahun) {
    filters.push('s.tahun = ?');
    vals.push(tahun);
  }

  const where = filters.length ? 'WHERE ' + filters.join(' AND ') : '';

  const allowedSort = ['tahun', 'value_indikator'];
  const orderBy = allowedSort.includes(sort) ? sort : 'tahun';
  const dir = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  try {
    const sql = `
      SELECT s.id_statistik, s.tahun, s.value_indikator,
             n.nama_negara, i.nama_indikator
      FROM statistik s
      JOIN negara n ON s.id_negara = n.id_negara
      JOIN indikator i ON s.id_indikator = i.id_indikator
      ${where}
      ORDER BY ${orderBy} ${dir}
      LIMIT ? OFFSET ?
    `;

    const queryVals = [...vals, limit, offset];
    const [data] = await db.query(sql, queryVals);

    // Query untuk total count
    const countSql = `
      SELECT COUNT(*) AS count
      FROM statistik s
      ${where}
    `;
    const [countResult] = await db.query(countSql, vals);
    const total = parseInt(countResult[0].count);
    const total_pages = Math.ceil(total / limit);

    res.json({ status: 'success', page, total_pages, data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
