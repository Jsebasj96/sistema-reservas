const pool = require('../config/db');

const crearPedidoBar = async (req, res) => {
  const { userId, productos, total } = req.body;

  // Insertar el pedido del bar en la base de datos
  const nuevoPedidoBar = await pool.query(
    'INSERT INTO pedidos (user_id, productos, total) VALUES ($1, $2, $3) RETURNING *',
    [userId, productos, total]
  );

  res.status(201).json({ message: 'Pedido del bar creado exitosamente', pedido: nuevoPedidoBar.rows[0] });
};

const getPedidosBarByUser = async (req, res) => {
  const { userId } = req.params;

  const pedidosBar = await pool.query('SELECT * FROM pedidos WHERE user_id = $1 AND tipo = \'bar\'', [userId]);

  res.json({ pedidos: pedidosBar.rows });
};

module.exports = {
  crearPedidoBar,
  getPedidosBarByUser,
};

