const db = require('../models/db');

const getData = (req, res) => {
  let { page = 1, limit = 10, sort_by = 'id', order = 'asc' } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  let sql = `SELECT * FROM indikator ORDER BY ?? ${order.toUpperCase()} LIMIT ? OFFSET ?`;
  db.query(sql, [sort_by, limit, offset], (err, results) => {
    if (err) return res.status(500).json({ status: "error", message: err.message });
    res.json({
      status: "success",
      message: "Data fetched successfully",
      page,
      data: results
    });
  });
};

module.exports = { getData };
