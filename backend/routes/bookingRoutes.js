const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { createBooking, getUserBookings, cancelBooking, payBooking, getBookingById, generateBookingPDF } = require('../models/Booking');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// ✅ Crear una reserva
router.post('/', verifyToken, async (req, res) => {
  const { flightId, category, segments } = req.body;

  if (!["turista", "business"].includes(category)) {
    return res.status(400).json({ message: "Categoría no válida" });
  }

  try {
    const newBooking = await createBooking(req.user.userId, flightId, category, segments || []);
    if (!newBooking || !newBooking.id) {
      return res.status(500).json({ error: "No se pudo crear la reserva" });
    }

    res.status(201).json({
      message: 'Reserva creada con éxito',
      booking: newBooking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 Obtener una reserva por ID
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

    console.log(`🔍 Verificando si existe el PDF en: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      console.log("📌 Archivo no existe. Generando nuevo PDF...");

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

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

      stream.on("finish", () => {
        console.log(`✅ PDF generado con éxito: ${filePath}`);
        res.download(filePath, `ticket_${booking.id}.pdf`);
      });

      stream.on("error", (err) => {
        console.error("❌ Error al escribir el archivo PDF:", err);
        res.status(500).json({ message: "Error al generar el ticket" });
      });

    } else {
      console.log("✅ El archivo ya existe. Enviando PDF...");
      res.download(filePath, `ticket_${booking.id}.pdf`);
    }

  } catch (error) {
    console.error("❌ Error general en la generación del ticket:", error);
    res.status(500).json({ message: "Error al generar el ticket" });
  }
});

// ✅ Ruta para generar el PDF en memoria y enviarlo directamente
router.get('/:id/pdf', verifyToken, async (req, res) => {
  try {
    const pdfBuffer = await generateBookingPDF(req.params.id);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ticket_${req.params.id}.pdf"`);

    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ Error al generar el PDF:", error);
    res.status(500).json({ error: "Error al generar el PDF" });
  }
});

module.exports = router;