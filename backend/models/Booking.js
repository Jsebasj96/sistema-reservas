const fs = require("fs");
const PDFDocument = require("pdfkit");
const pool = require("../config/db");
const path = require("path");

// 🔥 Crear una nueva reserva con precio según categoría
const createBooking = async (userId, flightId, category, segments) => {
  try {
    const priceField = category === "business" ? "price_business" : "price_turista";
    const flightResult = await pool.query(
      `SELECT ${priceField} AS price FROM flights WHERE id = $1`,
      [flightId]
    );

    if (flightResult.rows.length === 0) throw new Error("Vuelo no encontrado");

    const price = flightResult.rows[0].price;

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

// 🔥 Obtener todas las reservas del usuario autenticado
const getUserBookings = async (userId) => {
  const result = await pool.query(
    `SELECT b.id, f.airline, f.origin, f.destination, f.departure_time, f.arrival_time, 
            b.price, b.category, b.booking_date, b.status 
     FROM bookings b 
     INNER JOIN flights f ON b.flight_id = f.id 
     WHERE b.user_id = $1 
     ORDER BY b.booking_date DESC`,
    [userId]
  );
  return result.rows;
};

// ❌ Cancelar una reserva
const cancelBooking = async (bookingId, userId) => {
  const result = await pool.query(
    "UPDATE bookings SET cancelled = TRUE, status = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    ["CANCELLED", bookingId, userId]
  );
  return result.rows[0];
};

// 🔥 Generar un PDF con los detalles de la reserva
const generateBookingPDF = async (bookingId) => {
  try {
    const result = await pool.query(`
      SELECT b.*, f.airline, f.origin, f.destination, f.departure_time, f.arrival_time
      FROM bookings b
      INNER JOIN flights f ON b.flight_id = f.id
      WHERE b.id = $1
    `, [bookingId]);

    const booking = result.rows[0];
    if (!booking) throw new Error("Reserva no encontrada");

    const ticketDir = path.join(__dirname, "../tickets");
    if (!fs.existsSync(ticketDir)) fs.mkdirSync(ticketDir, { recursive: true });

    const filePath = path.join(ticketDir, `reserva_${booking.id}.pdf`);
    const doc = new PDFDocument();

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // 📜 Escribir contenido mínimo en el PDF para pruebas
    doc.fontSize(20).text("Ticket de Reserva", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Aerolínea: ${booking.airline}`);
    doc.text(`Origen: ${booking.origin}`);
    doc.text(`Destino: ${booking.destination}`);
    doc.text(`Salida: ${new Date(booking.departure_time).toLocaleString()}`);
    doc.text(`Categoría: ${booking.category}`);
    doc.text(`Precio: $${booking.price}`);
    doc.text(`Estado: ${booking.status}`);

    doc.end(); // ✅ Asegurar que el documento se cierra correctamente

    // 📌 Esperar a que el archivo se escriba completamente antes de devolverlo
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
       SET paid = TRUE, status = $1 
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      ["PAID", bookingId, userId]
    );

    const booking = result.rows[0];
    if (!booking) throw new Error("Reserva no encontrada");

    // 🔥 Generar el PDF con la información de la reserva
    const pdfPath = await generateBookingPDF(booking.id);
    return { ...booking, pdfPath }; // ✅ Devolvemos la ruta del PDF
  } catch (error) {
    throw new Error("Error al procesar el pago: " + error.message);
  }
};

// 🔍 Obtener una reserva por ID
const getBookingById = async (bookingId) => {
  try {
    const result = await pool.query(`
      SELECT b.*, f.airline, f.origin, f.destination, f.departure_time, f.arrival_time
      FROM bookings b
      INNER JOIN flights f ON b.flight_id = f.id
      WHERE b.id = $1
    `, [bookingId]);

    return result.rows[0];
  } catch (error) {
    throw new Error("Error al obtener la reserva");
  }
};

// ✅ Exportamos las funciones sin duplicaciones
module.exports = { createBooking, getUserBookings, cancelBooking, payBooking, getBookingById, generateBookingPDF };