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
const generateBookingPDF = async (booking) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, `../tickets/ticket_${booking.id}.pdf`);

  // Crear carpeta 'tickets' si no existe
  if (!fs.existsSync(path.join(__dirname, "../tickets"))) {
    fs.mkdirSync(path.join(__dirname, "../tickets"), { recursive: true });
  }

  // Crear el flujo de escritura
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // 🛫 Título del ticket
  doc.fontSize(18).text("✈ Ticket de Reserva ✈", { align: "center" }).moveDown();
  
  // 📌 Detalles de la reserva
  doc.fontSize(14).text(`ID de Reserva: ${booking.id}`);
  doc.text(`Usuario ID: ${booking.user_id}`);
  doc.text(`Vuelo ID: ${booking.flight_id}`);
  doc.text(`Categoría: ${booking.category}`);
  doc.text(`Precio: $${booking.price}`);
  doc.text(`Estado: ${booking.status}`);
  doc.text(`Fecha de Reserva: ${booking.booking_date}`);

  // Finalizar y guardar el documento
  doc.end();

  return filePath; // Retornar la ruta del archivo
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
    const pdfPath = await generateBookingPDF(booking);
    return { ...booking, pdfPath }; // Devolvemos la ruta del PDF
  } catch (error) {
    throw new Error("Error al procesar el pago: " + error.message);
  }
};

// 🔍 Obtener una reserva por ID
const getBookingById = async (bookingId) => {
  try {
    const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [bookingId]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error al obtener la reserva");
  }
};

module.exports = { createBooking, getUserBookings, cancelBooking, payBooking, getBookingById };