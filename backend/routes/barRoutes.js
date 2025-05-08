const express = require('express');
const router = express.Router();
const barController = require('../controllers/barController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/pedido',  verifyToken, barController.createOrder);
router.get('/pedidos',  verifyToken, barController.getAllOrders);

module.exports = router;
