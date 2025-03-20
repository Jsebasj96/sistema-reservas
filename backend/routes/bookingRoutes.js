const express = require('express');
const { check, validationResult } = require('express-validator');
const { createBooking, getUserBookings } = require('../models/Booking');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Crear una reserva (🔒 Solo usuarios autenticados)
router.post(
  '/',
  verifyToken,
  [
    check('flightId', 'El ID del vuelo es obligatorio y debe ser un número').isInt({ gt: 0 })
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  async (req, res) => {
    const { flightId } = req.body;
    try {
      const newBooking = await createBooking(req.user.userId, flightId);
      res.status(201).json({ message: 'Reserva creada con éxito', booking: newBooking });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;