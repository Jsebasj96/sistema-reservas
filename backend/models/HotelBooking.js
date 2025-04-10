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

// Generar PDF con la información del hotel reservado
const generateHotelBookingPDF = async (bookingId) => {
  const result = await pool.query(`
    SELECT hb.*, h.name AS hotel_name, h.city, h.address, h.price_per_night
    FROM hotel_bookings hb
    INNER JOIN hotels h ON hb.hotel_id = h.id
    WHERE hb.id = $1
  `, [bookingId]);

  const booking = result.rows[0];
  if (!booking) throw new Error("Reserva de hotel no encontrada");

  const doc = new PDFDocument();
  const ticketDir = path.join(__dirname, "../tickets");
  if (!fs.existsSync(ticketDir)) fs.mkdirSync(ticketDir);

  const filePath = path.join(ticketDir, `hotel_booking_${booking.id}.pdf`);
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(20).text("🏨 Reserva de Hotel", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Hotel: ${booking.hotel_name}`);
  doc.text(`Ciudad: ${booking.city}`);
  doc.text(`Dirección: ${booking.address}`);
  doc.text(`Precio por noche: $${booking.price_per_night}`);
  doc.text(`Check-in: ${booking.check_in}`);
  doc.text(`Check-out: ${booking.check_out}`);

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(filePath));
    stream.on("error", (err) => reject("Error al generar PDF: " + err.message));
  });
};

// Obtener detalles de una reserva de hotel por ID
const getHotelBookingById = async (bookingId) => {
  const result = await pool.query(
    `SELECT hb.*, h.name AS hotel_name, h.city, h.address, h.price_per_night 
     FROM hotel_bookings hb 
     INNER JOIN hotels h ON hb.hotel_id = h.id 
     WHERE hb.id = $1`,
    [bookingId]
  );
  return result.rows[0];
};

module.exports = { createHotelBooking,generateHotelBookingPDF,getHotelBookingById};



