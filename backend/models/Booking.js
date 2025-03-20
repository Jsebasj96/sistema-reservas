const pool = require('../config/db');

// Crear una nueva reserva
const createBooking = async (userId, flightId) => {
  const result = await pool.query(
    'INSERT INTO bookings (user_id, flight_id) VALUES ($1, $2) RETURNING *',
    [userId, flightId]
  );
  return result.rows[0];
};

// Obtener todas las reservas de un usuario
const getUserBookings = async (userId) => {
  const result = await pool.query(
    'SELECT b.id, f.airline, f.origin, f.destination, f.departure_time, f.arrival_time, f.price, b.booking_date, b.status FROM bookings b INNER JOIN flights f ON b.flight_id = f.id WHERE b.user_id = $1 ORDER BY b.booking_date DESC',
    [userId]
  );
  return result.rows;
};

// Cancelar una reserva por ID
const cancelBooking = async (bookingId, userId) => {
  const result = await pool.query(
    'UPDATE bookings SET cancelled = TRUE, status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
    ['CANCELLED', bookingId, userId]
  );
  return result.rows[0];
};

// Simular el pago de una reserva
const payBooking = async (bookingId, userId) => {
  const result = await pool.query(
    'UPDATE bookings SET paid = TRUE, status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
    ['PAID', bookingId, userId]
  );
  return result.rows[0];
};

// Exportar funciones correctamente
module.exports = { createBooking, getUserBookings, cancelBooking, payBooking };