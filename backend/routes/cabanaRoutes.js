const express = require('express');
const router = express.Router();
const {
  getAllCabanas,
  getAvailableCabanas,
  createCabana
} = require('../controllers/cabanaController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/',              verifyToken, getAllCabanas);
router.get('/disponibles',   verifyToken, getAvailableCabanas);  // 🔹
router.post('/',             verifyToken, createCabana);

module.exports = router;

