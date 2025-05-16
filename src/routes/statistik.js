const router = require('express').Router();
const { listStatistik } = require('../controllers/statistikController');
router.get('/', listStatistik);
module.exports = router;
