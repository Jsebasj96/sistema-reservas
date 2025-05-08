const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/',    verifyToken, habitacionController.getAllHabitaciones);
router.post('/',   verifyToken, habitacionController.createHabitacion);

module.exports = router;