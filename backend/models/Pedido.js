const pool = require('../config/db');  // Conexión a la base de datos

const Pedido = {
  // Función para obtener todos los pedidos
  getAllPedidos: async () => {
    const query = 'SELECT * FROM pedidos';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Función para obtener un pedido por ID
  getPedidoById: async (id) => {
    const query = 'SELECT * FROM pedidos WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Función para crear un nuevo pedido
  createPedido: async (clienteId, productos, total) => {
    const query = 'INSERT INTO pedidos (cliente_id, productos, total) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(query, [clienteId, productos, total]);
    return rows[0];
  },

  // Función para actualizar un pedido
  updatePedido: async (id, clienteId, productos, total) => {
    const query = 'UPDATE pedidos SET cliente_id = $1, productos = $2, total = $3 WHERE id = $4 RETURNING *';
    const { rows } = await pool.query(query, [clienteId, productos, total, id]);
    return rows[0];
  },

  // Función para eliminar un pedido
  deletePedido: async (id) => {
    const query = 'DELETE FROM pedidos WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

module.exports = Pedido;
