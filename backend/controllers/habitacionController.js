const pool = require('../config/db');

const getAllHabitaciones = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM habitaciones');
    res.json({ habitaciones: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const createHabitacion = async (req, res) => {
  const { tipo, precio, disponible } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO habitaciones (tipo,precio,disponible) VALUES ($1,$2,$3) RETURNING *`,
      [tipo, precio, disponible]
    );
    res.status(201).json({ habitacion: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { getAllHabitaciones, createHabitacion };