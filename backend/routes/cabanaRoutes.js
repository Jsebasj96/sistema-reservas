const express = require('express');
const router = express.Router();
const {
  getAllCabanas,
  getAvailableCabanas,
  createCabana
} = require('../controllers/cabanaController');

const { verifyToken } = require('../middleware/authMiddleware');

// Puedes quitar `verifyToken` si quieres acceso público a estas rutas
router.get('/',              getAllCabanas);
router.get('/disponibles',   getAvailableCabanas);
router.post('/',             createCabana);

module.exports = router;

