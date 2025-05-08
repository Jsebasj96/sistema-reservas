const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para procesar un pago
router.post('/', authMiddleware.verifyToken, pagoController.processPago);

// Ruta para obtener los pagos realizados
router.get('/', authMiddleware.verifyToken, pagoController.getAllPagos);

module.exports = router;
