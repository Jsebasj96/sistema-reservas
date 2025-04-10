const pool = require("../config/db");

// Crear reserva de hotel
const createHotelBooking = async (userId, hotelId, checkIn, checkOut) => {
  const totalPrice = 200000; // ✅ Puedes calcularlo dinámicamente si quieres
  const status = "PENDING";

  const result = await pool.query(
    `INSERT INTO hotel_bookings (user_id, hotel_id, check_in, check_out, total_price, booking_date, status) 
     VALUES ($1, $2, $3, $4, $5, NOW(), $6) RETURNING *`,
    [userId, hotelId, checkIn, checkOut, totalPrice, status]
  );
  return result.rows[0];
};

module.exports = { createHotelBooking };



