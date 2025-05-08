const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para reservar una habitación
router.post('/', authMiddleware.verifyToken, habitacionController.createReserva);

// Ruta para obtener todas las habitaciones
router.get('/', authMiddleware.verifyToken, habitacionController.getAllHabitaciones);

// Ruta para obtener una habitación por ID
router.get('/:id', authMiddleware.verifyToken, habitacionController.getHabitacionById);

module.exports = router;
