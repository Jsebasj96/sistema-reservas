const pool = require("../config/db");

// Crear reserva de hotels
const createHotelBooking = async (userId, hotelId, checkIn, checkOut) => {
  const result = await pool.query(
    `INSERT INTO hotel_bookings (user_id, hotel_id, check_in, check_out) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, hotelId, checkIn, checkOut]
  );
  return result.rows[0];
};

module.exports = { createHotelBooking };



