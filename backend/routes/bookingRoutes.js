const express = require('express');
const verifyToken = require('../middlewares/authMiddleware'); 
const { createBooking, getUserBookings, cancelBooking, payBooking } = require('../models/Booking'); // Asegurarse de importar payBooking

const router = express.Router();

// Crear una reserva
router.post('/', verifyToken, async (req, res) => {
  const { flightId } = req.body;
  try {
    const newBooking = await createBooking(req.user.userId, flightId);
    res.status(201).json({ message: 'Reserva creada con éxito', booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las reservas del usuario autenticado
router.get('/', verifyToken, async (req, res) => {
  try {
    const bookings = await getUserBookings(req.user.userId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ❌ Cancelar una reserva
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const cancelledBooking = await cancelBooking(req.params.id, req.user.userId);
    if (!cancelledBooking) {
      return res.status(404).json({ message: 'Reserva no encontrada o no autorizada' });
    }
    res.json({ message: 'Reserva cancelada con éxito', booking: cancelledBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 💳 Pagar una reserva
router.post('/:id/pay', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const paidBooking = await payBooking(id, userId);

    if (!paidBooking) {
      return res.status(404).json({ message: 'Reserva no encontrada o ya pagada' });
    }

    res.json({ message: 'Pago realizado con éxito', booking: paidBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
});

module.exports = router;