// routes/pedidoRoutes.js
const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const pedidoController = require('../controllers/pedidoController');

// Crear un nuevo pedido (mesero)
// Con verifyToken podrías restringir al rol “mesero”
router.post('/', verifyToken, pedidoController.createPedido);

// Obtener todos los pedidos
router.get('/', verifyToken, pedidoController.getAllPedidos);

// Obtener totales por categoría (opcional, para reportes)
router.get('/ingresos-por-categoria', verifyToken, pedidoController.getIngresosPorCategoria);

module.exports = router;



