const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const PDFDocument = require("pdfkit");
const {
  createHotelBooking,
  generateHotelBookingPDF,
  getHotelBookingById
} = require("../models/HotelBooking");

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
    res.status(500).json({ error: "Error al reservar hotel" });
  }
});

// Nueva ruta para descargar PDF
router.get("/:id/pdf", verifyToken, async (req, res) => {
  try {
    const booking = await getHotelBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    const doc = new PDFDocument();
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="reserva_hotel_${booking.id}.pdf"`);
      res.send(pdfBuffer);
    });

    // Contenido del PDF
    doc.fontSize(20).text("🏨 Reserva de Hotel", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Hotel: ${booking.hotel_name}`);
    doc.text(`Dirección: ${booking.address}`);
    doc.text(`Ciudad: ${booking.city}`);
    doc.text(`Precio por noche: $${booking.price_per_night}`);
    doc.moveDown();
    doc.text(`Check-in: ${booking.check_in}`);
    doc.text(`Check-out: ${booking.check_out}`);
    doc.text(`ID de Usuario: ${booking.user_id}`);

    doc.end();
  } catch (error) {
    console.error("❌ Error al generar PDF:", error);
    res.status(500).json({ error: "Error al generar el PDF" });
  }
});

module.exports = router;

