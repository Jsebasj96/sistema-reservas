const pool = require('../config/db');  // Conexión a la base de datos

const Pago = {
  // Función para obtener todos los pagos
  getAllPagos: async () => {
    const query = 'SELECT * FROM pagos';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Función para obtener un pago por ID
  getPagoById: async (id) => {
    const query = 'SELECT * FROM pagos WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Función para crear un nuevo pago
  createPago: async (usuarioId, monto, metodo, estado) => {
    const query = 'INSERT INTO pagos (usuario_id, monto, metodo, estado) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await pool.query(query, [usuarioId, monto, metodo, estado]);
    return rows[0];
  },

  // Función para actualizar un pago
  updatePago: async (id, usuarioId, monto, metodo, estado) => {
    const query = 'UPDATE pagos SET usuario_id = $1, monto = $2, metodo = $3, estado = $4 WHERE id = $5 RETURNING *';
    const { rows } = await pool.query(query, [usuarioId, monto, metodo, estado, id]);
    return rows[0];
  },

  // Función para eliminar un pago
  deletePago: async (id) => {
    const query = 'DELETE FROM pagos WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

module.exports = Pago;

