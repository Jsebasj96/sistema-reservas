const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  payBooking,
  getBookingById,
} = require("../models/Booking");

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const qr = require("qrcode");

const router = express.Router();

// ✅ Crear una reserva
router.post("/", verifyToken, async (req, res) => {
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
      message: "Reserva creada con éxito",
      booking: newBooking,
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

// 📄 **Generar un ticket en PDF y descargarlo**
router.get("/:id/ticket", verifyToken, async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    const filePath = path.join(__dirname, `../tickets/ticket_${booking.id}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ✅ **Datos en el PDF**
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

  } catch (error) {
    console.error("❌ Error general en la generación del ticket:", error);
    res.status(500).json({ message: "Error al generar el ticket" });
  }
});

// 📄 **Generar y descargar ticket en PDF con QR**
router.get("/:id/ticket", verifyToken, async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    // 📂 **Asegurar que el directorio existe**
    const ticketsDir = path.join(__dirname, "../tickets");
    if (!fs.existsSync(ticketsDir)) {
      fs.mkdirSync(ticketsDir, { recursive: true });
    }

    const filePath = path.join(ticketsDir, `ticket_${booking.id}.pdf`);
    const qrCodePath = path.join(__dirname, `qr_${booking.id}.png`);

    // 📌 **Generar código QR con la información de la reserva**
    const qrCodeData = `Reserva: ${booking.id} | Usuario: ${booking.user_id} | Vuelo: ${booking.flight_id} | Categoría: ${booking.category} | Precio: ${booking.price}`;
    await qr.toFile(qrCodePath, qrCodeData);

    // 📌 **Crear documento PDF**
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ✈ **Encabezado con aerolínea**
    doc.font("Helvetica-Bold").fontSize(22).text("✈️ Airline Express", { align: "center" });
    doc.moveDown(1);

    // 📌 **Código QR**
    doc.image(qrCodePath, 400, doc.y, { fit: [100, 100], align: "right" });

    // 🎫 **Código de reserva**
    doc.fontSize(16).text(`🎫 Código de Reserva: ${booking.id}`, { align: "left" });
    doc.moveDown();

    // 👤 **Datos del pasajero**
    doc.fontSize(12).font("Helvetica").text(`👤 Usuario ID: ${booking.user_id}`);
    doc.moveDown();

    // ✈ **Detalles del vuelo**
    doc.fontSize(14).font("Helvetica-Bold").text("Detalles del vuelo", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).font("Helvetica");
    doc.text(`🛫 Origen: ${booking.origin || "No disponible"}`);
    doc.text(`🛬 Destino: ${booking.destination || "No disponible"}`);
    doc.text(`📅 Fecha: ${new Date(booking.booking_date).toLocaleDateString()}`);
    doc.text(`💺 Categoría: ${booking.category.toUpperCase()}`);
    doc.text(`💰 Precio: $${Number(booking.price).toFixed(2)}`);
    doc.moveDown();

    // 📌 **Línea divisoria**
    doc.moveDown();
    doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // ✅ **Mensaje final**
    doc.fontSize(12).font("Helvetica-Oblique").text(
      "Este ticket es válido para abordar. Presentarlo en el aeropuerto junto con su documento de identidad.",
      { align: "center" }
    );

    doc.end();

    // 📌 **Eliminar QR temporal después de generarlo**
    stream.on("finish", () => {
      fs.unlinkSync(qrCodePath);
      res.download(filePath, `ticket_${booking.id}.pdf`);
    });

  } catch (error) {
    console.error("❌ Error al generar el ticket:", error);
    res.status(500).json({ message: "Error al generar el ticket" });
  }
});

module.exports = router;