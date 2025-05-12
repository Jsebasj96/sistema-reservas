const pool = require('../config/db');

// Crear reserva
exports.crearReserva = async (req, res) => {
  const { cliente_id, alojamiento_id, fecha_inicio, fecha_fin } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO reservas (cliente_id, alojamiento_id, fecha_inicio, fecha_fin)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [cliente_id, alojamiento_id, fecha_inicio, fecha_fin]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getAllReservas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservas ORDER BY fecha_inicio DESC');
    res.json({ reservas: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getReservaById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservas WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json({ reserva: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const cancelReserva = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM reservas WHERE id=$1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json({ message: 'Reserva cancelada', reserva: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { createReserva, getAllReservas, getReservaById, cancelReserva };
