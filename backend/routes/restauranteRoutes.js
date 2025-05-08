const express = require('express');
const router = express.Router();
const restauranteController = require('../controllers/restauranteController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/pedido',  verifyToken, restauranteController.createOrder);
router.get('/pedidos',  verifyToken, restauranteController.getAllOrders);

module.exports = router;

