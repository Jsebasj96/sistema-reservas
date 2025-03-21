const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { createBooking, getUserBookings, cancelBooking, payBooking, getBookingById } = require('../models/Booking');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// ✅ Crear una reserva con categoría y segmentos opcionales
router.post('/', verifyToken, async (req, res) => {
  const { flightId, category, segments } = req.body;

  // 🔍 Validar categoría
  if (!["turista", "business"].includes(category)) {
    return res.status(400).json({ message: "Categoría no válida" });
  }

  try {
    // 📌 Crear reserva en la base de datos
    const newBooking = await createBooking(req.user.userId, flightId, category, segments || []);

    // 🔍 Verificar si la reserva fue creada correctamente
    if (!newBooking || !newBooking.id) {
      return res.status(500).json({ error: "No se pudo crear la reserva" });
    }

    // ✅ Devolver la reserva con el `id`
    res.status(201).json({
      message: 'Reserva creada con éxito',
      booking: {
        id: newBooking.id,
        flight_id: newBooking.flight_id,
        user_id: newBooking.user_id,
        category: newBooking.category,
        price: newBooking.price,
        status: newBooking.status,
        created_at: newBooking.created_at,
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 Obtener todas las reservas del usuario autenticado
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ❌ Cancelar una reserva
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const cancelledBooking = await cancelBooking(req.params.id, req.user.userId);
    if (!cancelledBooking || !cancelledBooking.id) {
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
    if (!result || !result.id) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.status(200).json({ message: "Pago procesado correctamente", booking: result });
  } catch (error) {
    res.status(500).json({ message: "Error al procesar el pago" });
  }
});

// 📄 **Generar un ticket en PDF**
router.get("/:id/ticket", verifyToken, async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    const filePath = path.join(__dirname, `../tickets/ticket_${booking.id}.pdf`);

    // 📌 Verificar si el archivo ya existe para no generarlo de nuevo
    if (!fs.existsSync(filePath)) {
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(filePath));

      doc.fontSize(20).text("🎟 TICKET DE RESERVA", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Reserva ID: ${booking.id}`);
      doc.text(`Usuario ID: ${booking.user_id}`);
      doc.text(`Vuelo ID: ${booking.flight_id}`);
      doc.text(`Categoría: ${booking.category}`);
      doc.text(`Precio: $${booking.price}`);
      doc.text(`Estado: ${booking.status}`);
      doc.text(`Fecha de Reserva: ${new Date(booking.booking_date).toLocaleString()}`);

      doc.end();
    }

    // 📎 Enviar el archivo como respuesta
    res.download(filePath, `ticket_${booking.id}.pdf`);
  } catch (error) {
    res.status(500).json({ message: "Error al generar el ticket" });
  }
});

module.exports = router;