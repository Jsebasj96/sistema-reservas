const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { createBooking, getUserBookings, cancelBooking, payBooking } = require('../models/Booking');

const router = express.Router();

// ✅ Crear una reserva con categoría y precio calculado
router.post('/', verifyToken, async (req, res) => {
  const { flightId, category, segments } = req.body;

  if (!["turista", "business"].includes(category)) {
    return res.status(400).json({ message: "Categoría no válida" });
  }

  try {
    const newBooking = await createBooking(req.user.userId, flightId, category, segments || []);
    res.status(201).json({ message: 'Reserva creada con éxito', booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 Obtener todas las reservas del usuario autenticado
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

// 💳 Simular el pago de la reserva
router.post("/:id/pay", verifyToken, async (req, res) => {
  try {
    const result = await payBooking(req.params.id, req.user.userId);
    if (!result) return res.status(404).json({ message: "Reserva no encontrada" });

    res.status(200).json({ message: "Pago procesado correctamente", booking: result });
  } catch (error) {
    res.status(500).json({ message: "Error al procesar el pago" });
  }
});

module.exports = router;