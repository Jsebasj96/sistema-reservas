const pool = require('../config/db');

// Crear un nuevo usuario con más datos de contacto
const createUser = async (name, email, hashedPassword, role = 'user', phone, address) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password, role, phone, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, phone, address, created_at',
    [name, email, hashedPassword, role, phone, address]
  );
  return result.rows[0];
};

// Buscar un usuario por su email
const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT id, name, email, password, role FROM users WHERE email = $1', 
    [email]
  );
  return result.rows[0]; // Retorna toda la información, incluido el role
};

// Obtener un usuario por su ID
const findUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

// Obtener un usuario por ID (para ver perfil)
const getUserById = async (id) => {
  const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

// Actualizar los datos del usuario
const updateUser = async (id, name, email) => {
  const result = await pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
    [name, email, id]
  );
  return result.rows[0];
};

// Eliminar un usuario por ID
const deleteUser = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

// Exportar todas las funciones correctamente
module.exports = { 
  createUser, 
  findUserByEmail, 
  findUserById, 
  getUserById, 
  updateUser, 
  deleteUser 
};