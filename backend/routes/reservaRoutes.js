const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { verifyToken } = require('../middleware/authMiddleware');

// Ruta para realizar una nueva reserva
router.post('/', verifyToken, reservaController.createReserva);

// Ruta para obtener todas las reservas
router.get('/', verifyToken, reservaController.getAllReservas);

// Ruta para obtener una reserva por ID
router.get('/:id', verifyToken, reservaController.getReservaById);

// Ruta para cancelar una reserva
router.delete('/:id', verifyToken, reservaController.cancelReserva);

module.exports = router;


