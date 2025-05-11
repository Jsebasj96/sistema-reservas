const pool = require('../config/db');

const getAllHabitaciones = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM habitaciones');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las habitaciones' });
  }
};

const getAvailableHabitaciones = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, numero, capacidad, estado, precio_por_noche
       FROM habitaciones
       WHERE estado = 'Disponible'`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener habitaciones disponibles' });
  }
};

const createHabitacion = async (req, res) => {
  const { numero, capacidad, estado, precio_por_noche } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO habitaciones (numero, capacidad, estado)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [numero, capacidad, estado, precio_por_noche]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la Habitacion' });
  }
};

module.exports = {
  getAllHabitaciones,
  getAvailableHabitaciones,
  createHabitacion
};
