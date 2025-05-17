// src/app.js
const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const indikatorRoutes = require('./routes/indikator');
const statistikRoutes = require('./routes/statistik');
const negaraRoutes    = require('./routes/negara');
const topikRoutes     = require('./routes/topik');
const dataRoutes = require('./routes/data');

const app = express();
app.use(cors(), express.json());

app.use('/indikator', indikatorRoutes);
app.use('/statistik', statistikRoutes);
app.use('/negara', negaraRoutes);
app.use('/topik', topikRoutes);
app.use('/data', dataRoutes);

app.get('/', (req, res) => res.send('API World Bank Running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Listening on http://localhost:${PORT}`));
