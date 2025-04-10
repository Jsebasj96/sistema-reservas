const pool = require("../config/db");

// Obtener todos los hoteles por ciudad
const getHotelsByCity = async (city) => {
  const result = await pool.query(
    "SELECT * FROM hotels WHERE city ILIKE $1",
    [city]
  );
  return result.rows;
};

module.exports = { getHotelsByCity };

