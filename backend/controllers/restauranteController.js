const pool = require('../config/db');

const createOrder = async (req, res) => {
  const { clienteId, platoId, extras } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO consumiciones (user_id,plato_id,extras,fecha)
       VALUES ($1,$2,$3,NOW()) RETURNING *`,
      [clienteId, platoId, extras]
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