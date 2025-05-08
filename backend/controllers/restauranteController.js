const pool = require('../config/db');

const crearPedido = async (req, res) => {
  const { userId, platos, total } = req.body;

  // Insertar el pedido en la base de datos
  const nuevoPedido = await pool.query(
    'INSERT INTO pedidos (user_id, platos, total) VALUES ($1, $2, $3) RETURNING *',
    [userId, platos, total]
  );

  res.status(201).json({ message: 'Pedido creado exitosamente', pedido: nuevoPedido.rows[0] });
};

const getPedidosByUser = async (req, res) => {
  const { userId } = req.params;

  const pedidos = await pool.query('SELECT * FROM pedidos WHERE user_id = $1', [userId]);

  res.json({ pedidos: pedidos.rows });
};

module.exports = {
  crearPedido,
  getPedidosByUser,
};

