const express = require('express');
const router = express.Router();
const {
  getAllHabitaciones,
  getAvailableHabitaciones,
  createHabitacion
} = require('../controllers/habitacionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/',              getAllHabitaciones);
router.get('/disponibles',   getAvailableHabitaciones);  // 🔹
router.post('/',             createHabitacion);

module.exports = router;
