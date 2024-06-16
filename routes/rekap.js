const router = require('express').Router()
const RekapController = require('../controllers/rekapController');

router.get('/', RekapController.getRekap)

module.exports = router