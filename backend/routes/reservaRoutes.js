const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para realizar una nueva reserva
router.post('/', authMiddleware.verifyToken, reservaController.createReserva);

// Ruta para obtener todas las reservas
router.get('/', authMiddleware.verifyToken, reservaController.getAllReservas);

// Ruta para obtener una reserva por ID
router.get('/:id', authMiddleware.verifyToken, reservaController.getReservaById);

// Ruta para cancelar una reserva
router.delete('/:id', authMiddleware.verifyToken, reservaController.cancelReserva);

module.exports = router;
