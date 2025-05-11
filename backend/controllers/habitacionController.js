// controllers/habitacionController.js
const pool = require('../config/db');

const getAllHabitaciones = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, numero, capacidad, estado, created_at
       FROM habitaciones
       ORDER BY numero`
    );
    res.json({ habitaciones: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getAvailableHabitaciones = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, numero, capacidad, estado
       FROM habitaciones
       WHERE estado = 'Disponible'
       ORDER BY numero`
    );
    res.json({ habitaciones: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const createHabitacion = async (req, res) => {
  const { numero, capacidad, estado = 'Disponible' } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO habitaciones (numero, capacidad, estado)
       VALUES ($1, $2, $3)
       RETURNING id, numero, capacidad, estado, created_at`,
      [numero, capacidad, estado]
    );
    res.status(201).json({ habitacion: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = {
  getAllHabitaciones,
  getAvailableHabitaciones,
  createHabitacion
};
