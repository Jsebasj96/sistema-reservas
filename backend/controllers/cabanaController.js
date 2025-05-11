// controllers/cabanaController.js
const pool = require('../config/db');

const getAllCabanas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, capacidad, estado, created_at
       FROM cabañas
       ORDER BY nombre`
    );
    res.json({ cabanas: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getAvailableCabanas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, capacidad, estado
       FROM cabañas
       WHERE estado = 'Disponible'
       ORDER BY nombre`
    );
    res.json({ cabanas: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const createCabana = async (req, res) => {
  const { nombre, capacidad, estado = 'Disponible' } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO cabañas (nombre, capacidad, estado)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, capacidad, estado, created_at`,
      [nombre, capacidad, estado]
    );
    res.status(201).json({ cabana: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = {
  getAllCabanas,
  getAvailableCabanas,
  createCabana
};