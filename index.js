console.log('🚀 File index.js dimulai...');

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Endpoint utama hanya untuk cek server
app.get('/', (req, res) => {
  res.send('World Bank API is running...');
});

// ⬇⬇⬇ Endpoint Skenario
app.get('/statistik', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      country,
      daerah,
      indikator,
      tahun,
      sort_by = 'tahun',
      order = 'asc'
    } = req.query;

    const offset = (page - 1) * limit;
    let baseQuery = `
      SELECT 
        s.id_statistik,
        s.tahun,
        n.nama_negara,
        t.nama_topik,
        inc.jenis_income,
        i.nama_indikator,
        s.value_indikator
      FROM statistik s
      JOIN negara n ON s.id_negara = n.id_negara
      JOIN income inc ON n.id_income = inc.id_income
      JOIN indikator i ON s.id_indikator = i.id_indikator
      JOIN topik t ON i.id_topik = t.id_topik
      WHERE 1=1
    `;

    const params = [];

    if (country) {
      baseQuery += ' AND n.nama_negara = ?';
      params.push(country);
    }

    if (daerah) {
      baseQuery += ' AND n.id_daerah IN (SELECT id_daerah FROM daerah WHERE nama_daerah = ?)';
      params.push(daerah);
    }

    if (indikator) {
      baseQuery += ' AND i.kode_indikator = ?';
      params.push(indikator);
    }

    if (tahun) {
      baseQuery += ' AND s.tahun = ?';
      params.push(tahun);
    }

    // Count total untuk pagination
    const countQuery = `SELECT COUNT(*) as total FROM (${baseQuery}) as sub`;
    const [[{ total }]] = await db.query(countQuery, params);
    const totalPages = Math.ceil(total / limit);

    // Tambahkan sorting dan pagination
    baseQuery += ` ORDER BY ${sort_by} ${order === 'desc' ? 'DESC' : 'ASC'} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.query(baseQuery, params);

if (rows.length === 0) {
  return res.json({
    status: 'Sukses',
    message: 'Tidak ada data ditemukan',
    page: parseInt(page),
    total_pages: totalPages,
    data: []
  });
}

res.json({
  status: 'Sukses',
  message: 'Data berhasil diambil',
  page: parseInt(page),
  total_pages: totalPages,
  data: rows
});

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'Error',
      message: 'Server error',
      error: err.message
    });
  }
});

// ⬇⬇⬇ Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
