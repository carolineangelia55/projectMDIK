const router = require('express').Router();
const { getIndikatorByTopik } = require('../controllers/indikatorController');
router.get('/topik/:id_topik', getIndikatorByTopik);
module.exports = router;
