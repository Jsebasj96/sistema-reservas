const pool = require('../config/db');  // Conexión a la base de datos

const Reserva = {
  // Función para obtener todas las reservas
  getAllReservas: async () => {
    const query = 'SELECT * FROM reservas';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Función para obtener una reserva por ID
  getReservaById: async (id) => {
    const query = 'SELECT * FROM reservas WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Función para crear una nueva reserva
  createReserva: async (usuarioId, habitacionId, fechaInicio, fechaFin, total) => {
    const query = 'INSERT INTO reservas (usuario_id, habitacion_id, fecha_inicio, fecha_fin, total) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const { rows } = await pool.query(query, [usuarioId, habitacionId, fechaInicio, fechaFin, total]);
    return rows[0];
  },

  // Función para actualizar una reserva
  updateReserva: async (id, usuarioId, habitacionId, fechaInicio, fechaFin, total) => {
    const query = 'UPDATE reservas SET usuario_id = $1, habitacion_id = $2, fecha_inicio = $3, fecha_fin = $4, total = $5 WHERE id = $6 RETURNING *';
    const { rows } = await pool.query(query, [usuarioId, habitacionId, fechaInicio, fechaFin, total, id]);
    return rows[0];
  },

  // Función para eliminar una reserva
  deleteReserva: async (id) => {
    const query = 'DELETE FROM reservas WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

module.exports = Reserva;

