const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const PDFDocument = require("pdfkit");
const { getUserById } = require("../models/User");
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

    const user = await getUserById(booking.user_id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
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
    // ✨ Encabezado
      doc.fontSize(20).text("Ticket de Reserva de Hotel", { align: "center" });
      doc.moveDown();

      // 📍 Información del hotel
      doc.fontSize(14).text(`Hotel: ${booking.hotel_name}`);
      doc.text(`Ciudad: ${booking.city}`);
      doc.text(`Check-In: ${booking.check_in}`);
      doc.text(`Check-Out: ${booking.check_out}`);
      doc.moveDown();

      // 👤 Información del usuario
      doc.fontSize(14).text("Información del usuario:");
      doc.fontSize(12);
      doc.text(`Nombre: ${user.name}`);
      doc.text(`Correo: ${user.email}`);
      doc.moveDown();

      // ✅ Mensaje final
      doc.fontSize(12).font("Helvetica-Oblique").text(
        "Gracias por reservar con nosotros. Presenta este ticket al momento de hacer check-in.",
        { align: "center" }
      );
    doc.end();
  } catch (error) {
    console.error("❌ Error al generar PDF:", error);
    res.status(500).json({ error: "Error al generar el PDF" });
  }
});

module.exports = router;

