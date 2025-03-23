const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { getBookingById } = require('../models/Booking');

const router = express.Router();

// 📄 Generar y descargar ticket en PDF
router.get("/:id/ticket", verifyToken, async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    // 📂 Ruta de almacenamiento del ticket
    const ticketsDir = path.join(__dirname, '../tickets');
    if (!fs.existsSync(ticketsDir)) {
      fs.mkdirSync(ticketsDir, { recursive: true });
    }

    const filePath = path.join(ticketsDir, `ticket_${booking.id}.pdf`);

    // 📌 Generar el PDF
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

    // 📌 Esperar a que termine la escritura del archivo antes de enviarlo
    stream.on('finish', () => {
      res.download(filePath, `ticket_${booking.id}.pdf`);
    });

    stream.on('error', (err) => {
      console.error("❌ Error generando PDF:", err);
      res.status(500).json({ message: "Error al generar el ticket" });
    });

  } catch (error) {
    console.error("❌ Error en la generación del ticket:", error);
    res.status(500).json({ message: "Error al generar el ticket" });
  }
});

module.exports = router;