const pool = require('../config/db');

const createReserva = async (req, res) => {
  const { userId, habitacionId, fechaInicio, fechaFin, numPersonas } = req.body;

  const nuevaReserva = await pool.query(
    'INSERT INTO reservas (user_id, habitacion_id, fecha_inicio, fecha_fin, num_personas) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, habitacionId, fechaInicio, fechaFin, numPersonas]
  );

  res.status(201).json({ message: 'Reserva creada exitosamente', reserva: nuevaReserva.rows[0] });
};

const getReservasByUser = async (req, res) => {
  const { userId } = req.params;
  
  const reservas = await pool.query('SELECT * FROM reservas WHERE user_id = $1', [userId]);

  res.json({ reservas: reservas.rows });
};

module.exports = {
  createReserva,
  getReservasByUser,
};

