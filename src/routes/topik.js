const router = require('express').Router();
const { getAllTopik } = require('../controllers/topikController');
router.get('/', getAllTopik);
module.exports = router;
