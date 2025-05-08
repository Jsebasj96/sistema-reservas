const pool = require('../config/db');

// Crear una nueva reserva
const createReserva = async (req, res) => {
  const { habitacionId, fechaInicio, fechaFin, numPersonas } = req.body;
  const userId = req.user.id; // Tomamos el ID del usuario del token

  try {
    const nuevaReserva = await pool.query(
      `INSERT INTO reservas 
         (user_id, habitacion_id, fecha_inicio, fecha_fin, num_personas) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, habitacionId, fechaInicio, fechaFin, numPersonas]
    );

    res
      .status(201)
      .json({ message: 'Reserva creada exitosamente', reserva: nuevaReserva.rows[0] });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Obtener todas las reservas
const getAllReservas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservas ORDER BY fecha_inicio DESC');
    res.json({ reservas: result.rows });
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Obtener una reserva por su ID
const getReservaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM reservas WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json({ reserva: result.rows[0] });
  } catch (error) {
    console.error('Error al obtener reserva:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Cancelar (eliminar) una reserva
const cancelReserva = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM reservas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json({ message: 'Reserva cancelada', reserva: result.rows[0] });
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = {
  createReserva,
  getAllReservas,
  getReservaById,
  cancelReserva,
};

