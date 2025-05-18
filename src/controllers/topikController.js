const db = require('../models/db');

exports.getAllTopik = async (req, res) => {
  Object.keys(req.query).forEach((key) => {
    if (key != "page" && key != "limit" && key != "parent" && key != "sort_by" && key != "order") {
      return res.status(400).json({ status: 'error', message: 'Parameter tidak ditemukan'});
    }
  });

  let vals = [];
  let topik;
  let namaTopikList;
  let page;
  let limit;
  let sort_col; 
  let sort_order;
  let offset;
  let induk_id;
  let topik_id;
  let sql; 
  let sqlJum;

  if (req.query.parent) {
    topik = req.query.parent;
    namaTopikList = topik.split(':').map(s => s.trim());
  }
  if (req.query.page) {
    page = parseInt(req.query.page);
  } else {
    page = 1;
  }
  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  } else {
    limit = 20;
  }
  if (req.query.sort_by) {
    sort_col = req.query.sort_by;
  } else {
    sort_col = "id_topik";
  }
  if (req.query.order) {
    sort_order = req.query.order;
  } else {
    sort_order = "ASC";
  }
  offset = (page - 1) * limit;

  try {
    if (req.query.parent) {
      induk_id = 0;
      for (const nama of namaTopikList) {
        const sql = `SELECT id_topik FROM topik WHERE nama_topik = ? AND induk_topik = ? LIMIT 1`;
        const [rows] = await db.query(sql, [nama, induk_id]);

        if (rows.length === 0) {
          throw new Error(`Topik '${topik}' tidak ditemukan`);
        }

        topik_id = rows[0].id_topik;
        induk_id = topik_id; // untuk pencarian berikutnya
      }
      vals.push(topik_id);
    }

    sql = 'SELECT * FROM topik ';
    sqlJum = 'SELECT COUNT(*) as jum FROM topik ';
    if (req.query.parent) {
      sql += `WHERE induk_topik = ? `;
      sqlJum += `WHERE induk_topik = ? `;
    }
    const [ jum ] = await db.query(sqlJum, vals);
    const total = parseInt(jum[0].jum);
    const total_pages = Math.ceil(total / limit);

    sql += `ORDER BY ${sort_col} ${sort_order} `;
    vals.push(limit);
    vals.push(offset);
    sql += `LIMIT ? OFFSET ?`;

    const [ rows ] = await db.query(sql, vals);
    res.json({ status: 'success', message: 'Data fetched successfully', page: page, total_pages:total_pages, data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
    console.log(err.message);
  }
};
