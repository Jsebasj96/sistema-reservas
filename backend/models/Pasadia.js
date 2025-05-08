const pool = require('../config/db');  // Conexión a la base de datos

const Pasadia = {
  // Función para obtener todos los pasadías
  getAllPasadias: async () => {
    const query = 'SELECT * FROM pasadias';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Función para obtener un pasadía por ID
  getPasadiaById: async (id) => {
    const query = 'SELECT * FROM pasadias WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Función para crear un nuevo pasadía
  createPasadia: async (usuarioId, descripcion, precio, fecha) => {
    const query = 'INSERT INTO pasadias (usuario_id, descripcion, precio, fecha) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await pool.query(query, [usuarioId, descripcion, precio, fecha]);
    return rows[0];
  },

  // Función para actualizar un pasadía
  updatePasadia: async (id, usuarioId, descripcion, precio, fecha) => {
    const query = 'UPDATE pasadias SET usuario_id = $1, descripcion = $2, precio = $3, fecha = $4 WHERE id = $5 RETURNING *';
    const { rows } = await pool.query(query, [usuarioId, descripcion, precio, fecha, id]);
    return rows[0];
  },

  // Función para eliminar un pasadía
  deletePasadia: async (id) => {
    const query = 'DELETE FROM pasadias WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

module.exports = Pasadia;

