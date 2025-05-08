const pool = require('../config/db');  // Conexión a la base de datos

const Usuario = {
  // Función para obtener todos los usuarios
  getAllUsuarios: async () => {
    const query = 'SELECT * FROM users';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Función para obtener un usuario por ID
  getUsuarioById: async (id) => {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Función para crear un nuevo usuario
  createUsuario: async (nombre, email, contraseña, rol) => {
    const query = 'INSERT INTO users (nombre, email, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await pool.query(query, [nombre, email, contraseña, rol]);
    return rows[0];
  },

  // Función para actualizar un usuario
  updateUsuario: async (id, nombre, email, contraseña, rol) => {
    const query = 'UPDATE users SET nombre = $1, email = $2, contraseña = $3, rol = $4 WHERE id = $5 RETURNING *';
    const { rows } = await pool.query(query, [nombre, email, contraseña, rol, id]);
    return rows[0];
  },

  // Función para eliminar un usuario
  deleteUsuario: async (id) => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

module.exports = Usuario;

