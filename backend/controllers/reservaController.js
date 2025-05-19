const pool = require('../config/db');

const createReserva = async (req, res) => {
  const {habitacion_id,cabana_id,fecha_inicio,fecha_fin,total_pago,porcentaje_pagado,estado} = req.body;
  const userId = req.user.id;

  try {
    let query, params;

    if (habitacion_id) {
      query = `
        INSERT INTO reservas
          (user_id, habitacion_id, fecha_inicio, fecha_fin, total_pago, porcentaje_pagado, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;
      params = [userId, habitacion_id, fecha_inicio, fecha_fin, total_pago, porcentaje_pagado, estado];
    } else if (cabana_id) {
      query = `
        INSERT INTO reservas
          (user_id, cabana_id,    fecha_inicio, fecha_fin, total_pago, porcentaje_pagado, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;
      params = [userId, cabana_id, fecha_inicio, fecha_fin, total_pago, porcentaje_pagado, estado];
    } else {
      return res.status(400).json({ error: 'Debes indicar habitacion_id o cabana_id' });
    }

    const result = await pool.query(query, params);
    res.status(201).json({ reserva: result.rows[0] });

  } catch (err) {
    console.error('Error al crear reserva:', err);
    res.status(500).json({ error: 'Error al crear la reserva' });
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
