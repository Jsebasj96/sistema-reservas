const fs = require("fs");
const PDFDocument = require("pdfkit");
const pool = require("../config/db");
const path = require("path");

// ✅ Crear una nueva reserva sin segmentos (o con segmento vacío)
const createBooking = async (userId, flightId, category, segments = []) => {
  try {
    // Determinar el precio según la categoría
    const priceField = category === "business" ? "price_business" : "price_turista";
    const flightResult = await pool.query(
      `SELECT ${priceField} AS price FROM flights WHERE id = $1`,
      [flightId]
    );
    if (flightResult.rows.length === 0) throw new Error("Vuelo principal no encontrado");

    const price = flightResult.rows[0].price;

    // Guardar la reserva (almacenamos un array vacío o "[]" en la columna segments)
    const result = await pool.query(
      `INSERT INTO bookings (user_id, flight_id, category, segments, price, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, flightId, category, JSON.stringify(segments), price, "PENDING"]
    );

    return result.rows[0];
  } catch (error) {
    throw new Error("Error al crear la reserva: " + error.message);
  }
};

// 🔍 Obtener todas las reservas del usuario autenticado
const getUserBookings = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT b.id, f.airline, f.origin, f.destination, f.departure_time, f.arrival_time, 
              b.price, b.category, b.booking_date, b.status, b.segments
       FROM bookings b 
       INNER JOIN flights f ON b.flight_id = f.id 
       WHERE b.user_id = $1 
       ORDER BY b.booking_date DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw new Error("Error al obtener las reservas: " + error.message);
  }
};

// ❌ Cancelar una reserva
const cancelBooking = async (bookingId, userId) => {
  try {
    const result = await pool.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      ["CANCELLED", bookingId, userId]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error al cancelar la reserva: " + error.message);
  }
};

// 🔍 Obtener una reserva por ID (sin procesar segmentos)
const getBookingById = async (bookingId) => {
  try {
    const result = await pool.query(
      `SELECT b.*, f.airline, f.origin, f.destination, f.departure_time, f.arrival_time, f.code AS flight_code
       FROM bookings b
       INNER JOIN flights f ON b.flight_id = f.id
       WHERE b.id = $1`,
      [bookingId]
    );
    const booking = result.rows[0];
    if (!booking) return null;
    // Dejamos los segmentos como un array vacío (o lo que se haya guardado, pero sin procesar)
    booking.segments = [];
    return booking;
  } catch (error) {
    throw new Error("Error al obtener la reserva: " + error.message);
  }
};

// 📄 Generar un PDF con los detalles de la reserva
const generateBookingPDF = async (bookingId) => {
  try {
    const booking = await getBookingById(bookingId);
    if (!booking) throw new Error("Reserva no encontrada");

    const ticketDir = path.join(__dirname, "../tickets");
    if (!fs.existsSync(ticketDir)) fs.mkdirSync(ticketDir, { recursive: true });

    const filePath = path.join(ticketDir, `reserva_${booking.id}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Encabezado
    doc.fontSize(20).text("✈️ Ticket de Reserva", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Aerolínea: ${booking.airline}`);
    doc.text(`Vuelo: ${booking.flight_code}`);
    doc.text(`Origen: ${booking.origin}`);
    doc.text(`Destino: ${booking.destination}`);
    doc.text(`Salida: ${new Date(booking.departure_time).toLocaleString()}`);
    doc.text(`Categoría: ${booking.category}`);
    doc.text(`Precio Total: $${Number(booking.price).toFixed(2)}`);
    doc.text(`Estado: ${booking.status}`);

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", () => resolve(filePath));
      stream.on("error", (err) => reject("Error al escribir el PDF: " + err.message));
    });
  } catch (error) {
    throw new Error("Error al generar el PDF: " + error.message);
  }
};

// 💳 Simular el pago de una reserva y generar el PDF
const payBooking = async (bookingId, userId) => {
  try {
    const result = await pool.query(
      `UPDATE bookings 
       SET status = $1 
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      ["PAID", bookingId, userId]
    );
    const booking = result.rows[0];
    if (!booking) throw new Error("Reserva no encontrada");

    const pdfPath = await generateBookingPDF(booking.id);
    return { ...booking, pdfPath };
  } catch (error) {
    throw new Error("Error al procesar el pago: " + error.message);
  }
};

module.exports = { createBooking, getUserBookings, cancelBooking, payBooking, getBookingById, generateBookingPDF };