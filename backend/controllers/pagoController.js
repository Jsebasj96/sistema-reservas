const pool = require('../config/db');

const createPago = async (req, res) => {
  const { reservaId, pasadiaId, monto, metodo } = req.body;
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `INSERT INTO pagos (user_id,reserva_id,pasadia_id,monto,metodo,fecha)
       VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *`,
      [userId, reservaId||null, pasadiaId||null, monto, metodo]
    );
    res.status(201).json({ pago: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getAllPagos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pagos ORDER BY fecha DESC');
    res.json({ pagos: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getPagoById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pagos WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json({ pago: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { createPago, getAllPagos, getPagoById };
