const pool = require('../config/db');

// Obtener todas las cabañas
const getAllCabanas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cabanas');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las cabañas' });
  }
};

// Obtener solo cabañas disponibles
const getAvailableCabanas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, capacidad, estado, precio_por_noche
       FROM cabanas
       WHERE estado = 'Disponible'`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cabañas disponibles' });
  }
};

// Crear una nueva cabaña
const createCabana = async (req, res) => {
  const { nombre, capacidad, estado, precio_por_noche } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO cabanas (nombre, capacidad, estado, precio_por_noche)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombre, capacidad, estado, precio_por_noche]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la cabaña' });
  }
};

module.exports = {
  getAllCabanas,
  getAvailableCabanas,
  createCabana
};
