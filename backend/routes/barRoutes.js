const express = require('express');
const router = express.Router();
const barController = require('../controllers/barController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para realizar un pedido en el bar
router.post('/pedido', authMiddleware.verifyToken, barController.createPedido);

// Ruta para obtener los pedidos de bar
router.get('/pedido', authMiddleware.verifyToken, barController.getPedidos);

module.exports = router;
