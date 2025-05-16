const db = require('../models/db');

exports.listStatistik = async (req, res) => {
  let { page=1, limit=20, id_indikator, id_negara, tahun, sort='tahun', order='asc' } = req.query;
  page = parseInt(page); limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const filters = [];
  const vals    = [];

  if (id_indikator) { vals.push(id_indikator); filters.push(`s.id_indikator = $${vals.length}`); }
  if (id_negara)    { vals.push(id_negara);    filters.push(`s.id_negara = $${vals.length}`); }
  if (tahun)        { vals.push(tahun);        filters.push(`s.tahun = $${vals.length}`); }

  const where = filters.length ? 'WHERE ' + filters.join(' AND ') : '';
  const orderBy = ['tahun','value_indikator'].includes(sort) ? sort : 'tahun';
  const dir     = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  vals.push(limit, offset);
  const sql = `
    SELECT s.id_statistik, s.tahun, s.value_indikator,
           n.nama_negara, i.nama_indikator
    FROM statistik s
    JOIN negara n      ON s.id_negara    = n.id_negara
    JOIN indikator i   ON s.id_indikator = i.id_indikator
    ${where}
    ORDER BY ${orderBy} ${dir}
    LIMIT $${vals.length-1} OFFSET $${vals.length}`;
  const data = await db.query(sql, vals);

  // Hitung total pages (opsional, bisa dioptimalkan)
  const countSql = `SELECT COUNT(*) FROM statistik s ${where}`;
  const { rows } = await db.query(countSql, vals.slice(0, vals.length-2));
  const total = parseInt(rows[0].count);
  const total_pages = Math.ceil(total / limit);

  res.json({ status:'success', page, total_pages, data: data.rows });
};
