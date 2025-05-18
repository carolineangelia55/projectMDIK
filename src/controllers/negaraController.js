const db = require('../models/db');

exports.getAllNegara = async (req, res) => {
  Object.keys(req.query).forEach((key) => {
    if (key != "page" && key != "limit" && key != "income" && key != "daerah" && key != "sort_by" && key != "order") {
      return res.status(400).json({ status: 'error', message: 'Parameter tidak ditemukan'});
    }
  });

  let vals = [];
  let inc;
  let dae;
  let page;
  let limit;
  let sort_col;
  let sort_order;
  let offset;
  let sql;
  let sqlJum;
  
  if (req.query.income) {
    inc = req.query.income;
    vals.push(inc);
  }
  if (req.query.daerah) {
    dae = req.query.daerah;
    vals.push(dae);
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
    sort_col = "id_negara";
  }
  if (req.query.order) {
    sort_order = req.query.order;
  } else {
    sort_order = "ASC";
  }
  offset = (page - 1) * limit;

  try {
    sql = `
      SELECT id_negara, kode_negara, nama_negara 
      FROM negara n `;
    sqlJum = `SELECT COUNT(*) as jum 
      FROM negara n `;
    if (req.query.income) {
      sql += `LEFT JOIN income i 
      ON n.id_income = i.id_income `;
      sqlJum += `LEFT JOIN income i 
      ON n.id_income = i.id_income `;
    }
    if (req.query.daerah) {
      sql += `LEFT JOIN daerah d 
      ON n.id_daerah = d.id_daerah `;
      sqlJum += `LEFT JOIN daerah d 
      ON n.id_daerah = d.id_daerah `;
    }
    if (req.query.income) {
      sql += `WHERE jenis_income = ? `;
      sqlJum += `WHERE jenis_income = ? `;
    }
    if (req.query.daerah) {
      if (req.query.income) {
        sql += `AND `;
        sqlJum += `AND `;
      } else {
        sql += `WHERE `;
        sqlJum += `WHERE `;
      }
      sql += `nama_daerah = ? `;
      sqlJum += `nama_daerah = ? `;
    }

    const [ jum ] = await db.query(sqlJum, vals);
    const total = parseInt(jum[0].jum);
    const total_pages = Math.ceil(total / limit);

    sql += `ORDER BY ${sort_col} ${sort_order} `;
    vals.push(limit);
    vals.push(offset);

    sql += `LIMIT ? OFFSET ?`;
    const [ rows ] = await db.query(sql, vals);
    res.json({ status:'success',  message: 'Data fetched successfully', page: page, total_pages:total_pages, data: rows });
  } catch (err) {
    res.status(500).json({ status:'error', message: err.message });
    console.log(err.message);
  }
};
