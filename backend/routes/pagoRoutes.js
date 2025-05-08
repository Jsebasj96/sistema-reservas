const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/',      verifyToken, pagoController.createPago);
router.get('/',       verifyToken, pagoController.getAllPagos);
router.get('/:id',    verifyToken, pagoController.getPagoById);

module.exports = router;
