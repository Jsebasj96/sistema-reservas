const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  payBooking,
  getBookingById,
} = require("../models/Booking");

const { getUserById } = require("../models/User");
const { getFlightById } = require("../models/Flight");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const qr = require("qrcode");

const router = express.Router();

// ✅ Crear una reserva (sin segmentos)
router.post("/", verifyToken, async (req, res) => {
  const { flightId, category } = req.body; // Removemos "segments"

  if (!["turista", "business"].includes(category)) {
    return res.status(400).json({ message: "Categoría no válida" });
  }

  try {
    const newBooking = await createBooking(req.user.userId, flightId, category, []); // Pasamos un array vacío
    if (!newBooking || !newBooking.id) {
      return res.status(500).json({ error: "No se pudo crear la reserva" });
    }

    res.status(201).json({
      message: "Reserva creada con éxito",
      booking: newBooking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 Obtener una reserva por ID (sin segmentos)
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
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const cancelledBooking = await cancelBooking(req.params.id, req.user.userId);
    if (!cancelledBooking || !cancelledBooking.id) {
      return res.status(404).json({ message: "Reserva no encontrada o no autorizada" });
    }

    res.json({ message: "Reserva cancelada con éxito", booking: cancelledBooking });
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

  // ✅ Generar el PDF en memoria y enviarlo directamente (sin cambios respecto a segmentos)
  router.get("/:id/pdf", verifyToken, async (req, res) => {
    try {
      const booking = await getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Reserva no encontrada" });
      }

      const user = await getUserById(booking.user_id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const flight = await getFlightById(booking.flight_id);
      if (!flight) {
        return res.status(404).json({ message: "Vuelo no encontrado" });
      }

      const doc = new PDFDocument();
      let buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="ticket_${booking.id}.pdf"`);
        res.send(pdfBuffer);
      });

      // Encabezado con aerolínea
      doc.font("Helvetica-Bold").fontSize(36).text(" Airline Express", { align: "center" });
      doc.moveDown(1);
      // Código de reserva
      doc.fontSize(16).text(`Código de Reserva: ${booking.id}`, { align: "left" });
      doc.moveDown();
      // Datos del pasajero
      doc.fontSize(12).font("Helvetica").text(`Usuario ID: ${user.id}`);
      doc.text(`Nombre: ${user.name}`);
      doc.text(`Correo: ${user.email}`);
      doc.moveDown();
      // Código de Vuelo
      doc.fontSize(26).text(`Vuelo: ${flight.code}`, { align: "left" });
      doc.moveDown();
      // Detalles del vuelo
      doc.fontSize(14).font("Helvetica-Bold").text("Detalles del vuelo", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).font("Helvetica");
      doc.text(`Origen: ${booking.origin || "No disponible"}`);
      doc.text(`Destino: ${booking.destination || "No disponible"}`);
      doc.text(`Fecha: ${new Date(booking.booking_date).toLocaleDateString()}`);
      doc.text(`Categoría: ${booking.category.toUpperCase()}`);
      doc.text(`Precio: $${Number(booking.price).toFixed(2)}`);
      doc.moveDown();
      // Línea divisoria
      doc.moveDown();
      doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      // Mensaje final
      doc.fontSize(12).font("Helvetica-Oblique").text(
        "Este ticket es válido para abordar. Presentarlo en el aeropuerto junto con su documento de identidad.",
        { align: "center" }
      );

      doc.end();
    } catch (error) {
      console.error("❌ Error al generar el PDF:", error);
      res.status(500).json({ error: "Error al generar el PDF" });
    }
  });

module.exports = router;