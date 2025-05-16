const router = require('express').Router();
const { getAllNegara } = require('../controllers/negaraController');
router.get('/', getAllNegara);
module.exports = router;
