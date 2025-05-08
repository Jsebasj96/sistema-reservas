const pool = require('../config/db');

const reservarHabitacion = async (req, res) => {
  const { userId, habitacionId, fechaInicio, fechaFin } = req.body;

  // Verificar si la habitación está disponible
  const habitacionDisponible = await pool.query(
    'SELECT * FROM habitaciones WHERE id = $1 AND disponible = true',
    [habitacionId]
  );
  if (habitacionDisponible.rows.length === 0) {
    return res.status(400).json({ error: 'La habitación no está disponible' });
  }

  // Reservar la habitación
  const nuevaReserva = await pool.query(
    'INSERT INTO reservas (user_id, habitacion_id, fecha_inicio, fecha_fin) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, habitacionId, fechaInicio, fechaFin]
  );

  // Marcar la habitación como no disponible
  await pool.query('UPDATE habitaciones SET disponible = false WHERE id = $1', [habitacionId]);

  res.status(201).json({ message: 'Habitación reservada exitosamente', reserva: nuevaReserva.rows[0] });
};

const liberarHabitacion = async (req, res) => {
  const { habitacionId } = req.body;

  // Marcar la habitación como disponible
  await pool.query('UPDATE habitaciones SET disponible = true WHERE id = $1', [habitacionId]);

  res.json({ message: 'Habitación liberada exitosamente' });
};

module.exports = {
  reservarHabitacion,
  liberarHabitacion,
};
