const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const { createHotelBooking } = require("../models/HotelBooking");

const router = express.Router();

// Crear reserva de hotel
router.post("/", verifyToken, async (req, res) => {
  const { hotelId, checkIn, checkOut } = req.body;

  if (!hotelId || !checkIn || !checkOut) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    const newBooking = await createHotelBooking(req.user.userId, hotelId, checkIn, checkOut);
    res.status(201).json({ message: "Reserva de hotel creada con éxito", booking: newBooking });
  } catch (error) {
    console.error("❌ Error al reservar hotel:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
