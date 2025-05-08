const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/productos', verifyToken, inventarioController.getProductos);
router.get('/servicios', verifyToken, inventarioController.getServicios);

module.exports = router;
