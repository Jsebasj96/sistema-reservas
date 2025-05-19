const pool = require('../config/db');

const createPago = async (req, res) => {
  const { reservaId, monto, tipoPago } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO pagos (reserva_id, tipo_pago, monto, fecha_pago)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [reservaId, tipoPago, monto]
    );
    res.status(201).json({ pago: result.rows[0] });
  } catch (err) {
    console.error('Error al crear pago:', err);
    res.status(500).json({ error: 'Error al crear el pago' });
  }
};

const getAllPagos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pagos ORDER BY fecha_pago DESC');
    res.json({ pagos: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pagos' });
  }
};

const getPagoById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pagos WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json({ pago: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el pago' });
  }
};

module.exports = { createPago, getAllPagos, getPagoById };

