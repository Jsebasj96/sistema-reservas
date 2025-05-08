const express = require('express');
const router = express.Router();
const restauranteController = require('../controllers/restauranteController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para realizar un pedido en el restaurante
router.post('/pedido', authMiddleware.verifyToken, restauranteController.createPedido);

// Ruta para obtener los pedidos de restaurante
router.get('/pedido', authMiddleware.verifyToken, restauranteController.getPedidos);

module.exports = router;
