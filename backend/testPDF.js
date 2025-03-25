const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const qr = require("qrcode"); // 📌 Librería para generar QR
const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const { getBookingById } = require("../models/Booking");

const router = express.Router();

// 📄 **Generar y descargar ticket en PDF con QR**
router.get("/:id/ticket", verifyToken, async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    // 📂 **Ruta donde se almacenará el PDF**
    const ticketsDir = path.join(__dirname, "../tickets");
    if (!fs.existsSync(ticketsDir)) {
      fs.mkdirSync(ticketsDir, { recursive: true });
    }

    const filePath = path.join(ticketsDir, `ticket_${booking.id}.pdf`);

    // 📌 **Generar código QR con los detalles del vuelo**
    const qrCodeData = `Reserva: ${booking.id} | Usuario: ${booking.user_id} | Vuelo: ${booking.flight_id} | Categoría: ${booking.category} | Precio: ${booking.price}`;
    const qrCodePath = path.join(__dirname, `qr_${booking.id}.png`);
    await qr.toFile(qrCodePath, qrCodeData);

    // 📌 **Crear el documento PDF**
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ✈ **Encabezado con aerolínea**
    doc.font("Helvetica-Bold").fontSize(20).text("✈️ Airline Express", { align: "center" });
    doc.moveDown(0.5);

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
    fs.unlinkSync(qrCodePath);

    // 📌 **Enviar el PDF al usuario**
    stream.on("finish", () => {
      res.download(filePath, `ticket_${booking.id}.pdf`);
    });

  } catch (error) {
    console.error("❌ Error al generar el ticket:", error);
    res.status(500).json({ message: "Error al generar el ticket" });
  }
});

module.exports = router;