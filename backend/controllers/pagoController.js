const pool = require('../config/db');

const procesarPago = async (req, res) => {
  const { reservaId, cantidad } = req.body;

  // Verificar si la reserva existe
  const reserva = await pool.query('SELECT * FROM reservas WHERE id = $1', [reservaId]);
  if (reserva.rows.length === 0) {
    return res.status(400).json({ error: 'Reserva no encontrada' });
  }

  // Registrar pago
  const pago = await pool.query(
    'INSERT INTO pagos (reserva_id, cantidad) VALUES ($1, $2) RETURNING *',
    [reservaId, cantidad]
  );

  res.status(201).json({ message: 'Pago procesado exitosamente', pago: pago.rows[0] });
};

module.exports = {
  procesarPago,
};
