const pool = require('../config/db');

const createOrder = async (req, res) => {
  const { clienteId, bebidaId, cantidad } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO consumiciones (user_id,servicio_id,cantidad,fecha)
       VALUES ($1,$2,$3,NOW()) RETURNING *`,
      [clienteId, bebidaId, cantidad]
    );
    res.status(201).json({ order: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM consumiciones ORDER BY fecha DESC');
    res.json({ orders: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { createOrder, getAllOrders };
