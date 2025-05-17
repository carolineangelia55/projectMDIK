const router = require('express').Router();
const { getIndikatorByTopik } = require('../controllers/indikatorController');
router.get('/', getIndikatorByTopik);
module.exports = router;
