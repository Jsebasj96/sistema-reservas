const pool = require("../config/db");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Crear reserva de hotels
const createHotelBooking = async (userId, hotelId, checkIn, checkOut) => {
  const result = await pool.query(
    `INSERT INTO hotel_bookings (user_id, hotel_id, check_in, check_out) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, hotelId, checkIn, checkOut]
  );
  return result.rows[0];
};

// 🔍 Obtener una reserva de hotel por ID con datos del hotel y usuario
const getHotelBookingById = async (bookingId) => {
  const result = await pool.query(`
    SELECT hb.*, h.name AS hotel_name, h.city, u.name AS user_name, u.email, u.phone, u.address
    FROM hotel_bookings hb
    JOIN hotels h ON h.id = hb.hotel_id
    JOIN users u ON u.id = hb.user_id
    WHERE hb.id = $1
  `, [bookingId]);

  return result.rows[0];
};

// 📄 Generar PDF
const generateHotelBookingPDF = async (bookingId) => {
  const booking = await getHotelBookingById(bookingId);
  if (!booking) throw new Error("Reserva no encontrada");

  const ticketDir = path.join(__dirname, "../tickets");
  if (!fs.existsSync(ticketDir)) fs.mkdirSync(ticketDir, { recursive: true });

  const filePath = path.join(ticketDir, `hotel_reserva_${booking.id}.pdf`);
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // ✨ Encabezado
  doc.fontSize(20).text("🏨 Ticket de Reserva de Hotel", { align: "center" });
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
  doc.text(`Nombre: ${booking.user_name}`);
  doc.text(`Email: ${booking.email}`);
  doc.text(`Teléfono: ${booking.phone}`);
  doc.text(`Dirección: ${booking.address}`);
  doc.moveDown();

  // ✅ Mensaje final
  doc.fontSize(12).font("Helvetica-Oblique").text(
    "Gracias por reservar con nosotros. Presenta este ticket al momento de hacer check-in.",
    { align: "center" }
  );

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(filePath));
    stream.on("error", (err) => reject("Error al generar PDF: " + err.message));
  });
};

module.exports = { createHotelBooking,generateHotelBookingPDF,getHotelBookingById};



