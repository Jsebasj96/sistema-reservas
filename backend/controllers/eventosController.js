const pool = require('../config/db');

const createEvento = async (req, res) => {
  const { nombre_evento, descripcion, fecha_evento, tipo_evento, costo } = req.body;
  const userId = req.user.id; // desde verifyToken

  try {
    const result = await pool.query(
      `INSERT INTO eventos 
        (user_id, nombre_evento, descripcion, fecha_evento, tipo_evento, costo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, nombre_evento, descripcion, fecha_evento, tipo_evento, costo]
    );

    res.status(201).json({ evento: result.rows[0] });
  } catch (err) {
    console.error('Error al crear evento:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getAllEventos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM eventos ORDER BY fecha_evento DESC');
    res.json({ eventos: result.rows });
  } catch (err) {
    console.error('Error al obtener eventos:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { createEvento, getAllEventos };