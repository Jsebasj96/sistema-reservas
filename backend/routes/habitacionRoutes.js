const express = require('express');
const router = express.Router();
const {
  getAllHabitaciones,
  getAvailableHabitaciones,
  createHabitacion
} = require('../controllers/habitacionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/',              verifyToken, getAllHabitaciones);
router.get('/disponibles',   verifyToken, getAvailableHabitaciones);  // 🔹
router.post('/',             verifyToken, createHabitacion);

module.exports = router;
