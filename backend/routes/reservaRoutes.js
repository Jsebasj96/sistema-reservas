const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Ruta para crear una nueva reserva, sólo accesible para administradores
router.post('/', authMiddleware.verifyToken, adminMiddleware, reservaController.createReserva);

// Otras rutas...
module.exports = router;

