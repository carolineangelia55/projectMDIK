const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Cek server jalan
// app.get('/', (req, res) => {
//   res.send('World Bank API is running 🚀');
// });

// Sebelum Pagination
// Cek server setelah import
// app.get('/indicators', async (req, res) => {
//     try {
//       const [rows] = await db.query('SELECT * FROM indicators LIMIT 25');
//       res.json({ data: rows });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Terjadi kesalahan server' });
//     }
//   });  

// Setelah Pagination
// Cek setelah import

app.get('/indicators', async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        country,
        year,
        indicator,
        sort_by = 'year',
        order = 'asc'
      } = req.query;
  
      const offset = (page - 1) * limit;
  
      let baseQuery = 'SELECT * FROM indicators WHERE 1=1';
      const params = [];
  
      if (country) {
        baseQuery += ' AND country_code = ?';
        params.push(country);
      }
  
      if (year) {
        baseQuery += ' AND year = ?';
        params.push(year);
      }
  
      if (indicator) {
        baseQuery += ' AND indicator_code = ?';
        params.push(indicator);
      }
  
      // Tambahkan sorting
      baseQuery += ` ORDER BY ${sort_by} ${order === 'desc' ? 'DESC' : 'ASC'}`;
  
      // Tambahkan pagination
      baseQuery += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
  
      const [rows] = await db.query(baseQuery, params);
  
      res.json({
        page: parseInt(page),
        limit: parseInt(limit),
        count: rows.length,
        data: rows
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
