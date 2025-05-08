const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para obtener todos los productos del inventario
router.get('/productos', authMiddleware.verifyToken, inventarioController.getAllProductos);

// Ruta para obtener un producto del inventario por ID
router.get('/producto/:id', authMiddleware.verifyToken, inventarioController.getProductoById);

// Ruta para agregar un nuevo producto al inventario (solo admins)
router.post('/producto', authMiddleware.verifyToken, authMiddleware.adminMiddleware, inventarioController.addProducto);

module.exports = router;
