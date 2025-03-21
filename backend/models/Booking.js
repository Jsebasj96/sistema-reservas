const pool = require('../config/db');

// 🔥 Crear una nueva reserva con precio según categoría
const createBooking = async (userId, flightId, category, segments) => {
  try {
    // ✅ Determinamos el precio según la categoría
    const priceField = category === "business" ? "price_business" : "price_turista";
    const flightResult = await pool.query(
      `SELECT ${priceField} AS price FROM flights WHERE id = $1`,
      [flightId]
    );

    if (flightResult.rows.length === 0) throw new Error("Vuelo no encontrado");

    const price = flightResult.rows[0].price;

    // 💥 Guardamos la reserva con el precio final
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
    'UPDATE bookings SET cancelled = TRUE, status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
    ['CANCELLED', bookingId, userId]
  );
  return result.rows[0];
};

// 💳 Simular el pago de una reserva
const payBooking = async (bookingId, userId) => {
  const result = await pool.query(
    `UPDATE bookings 
     SET paid = TRUE, status = $1 
     WHERE id = $2 AND user_id = $3 RETURNING *`,
    ['PAID', bookingId, userId]
  );
  return result.rows[0];
};

// Exportamos las funciones actualizadas
module.exports = { createBooking, getUserBookings, cancelBooking, payBooking };