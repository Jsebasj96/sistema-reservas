const pool = require("../config/db");

// Función para crear múltiples segmentos para una reserva
const createFlightSegments = async (bookingId, segments) => {
  const queryText = `
    INSERT INTO flight_segments (booking_id, flight_code, origin, destination, departure_time, arrival_time)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const createdSegments = [];
  for (const segment of segments) {
    // Cada segmento debe tener: flight_code, origin, destination, departure_time, arrival_time
    const { flight_code, origin, destination, departure_time, arrival_time } = segment;
    const result = await pool.query(queryText, [bookingId, flight_code, origin, destination, departure_time, arrival_time]);
    createdSegments.push(result.rows[0]);
  }
  return createdSegments;
};

// Función para obtener los segmentos de una reserva
const getFlightSegmentsByBookingId = async (bookingId) => {
  const result = await pool.query(
    "SELECT * FROM flight_segments WHERE booking_id = $1 ORDER BY departure_time ASC",
    [bookingId]
  );
  return result.rows;
};

module.exports = { createFlightSegments, getFlightSegmentsByBookingId };