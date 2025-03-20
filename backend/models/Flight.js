const pool = require('../config/db');

// Obtener todos los vuelos disponibles
const getAllFlights = async () => {
  const result = await pool.query('SELECT * FROM flights ORDER BY departure_time ASC');
  return result.rows;
};

// Obtener un vuelo por ID
const getFlightById = async (id) => {
  const result = await pool.query('SELECT * FROM flights WHERE id = $1', [id]);
  return result.rows[0];
};

// Crear un nuevo vuelo (para administradores)
const createFlight = async (airline, origin, destination, departure_time, arrival_time, price) => {
  const result = await pool.query(
    'INSERT INTO flights (airline, origin, destination, departure_time, arrival_time, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [airline, origin, destination, departure_time, arrival_time, price]
  );
  return result.rows[0];
};

module.exports = { getAllFlights, getFlightById, createFlight };