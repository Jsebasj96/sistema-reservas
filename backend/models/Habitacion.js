const pool = require('../config/db');  // Conexión a la base de datos

const Habitacion = {
  // Función para obtener todas las habitaciones
  getAllHabitaciones: async () => {
    const query = 'SELECT * FROM habitaciones';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Función para obtener una habitación por ID
  getHabitacionById: async (id) => {
    const query = 'SELECT * FROM habitaciones WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Función para crear una nueva habitación
  createHabitacion: async (numero, descripcion, capacidad, precio, estado) => {
    const query = 'INSERT INTO habitaciones (numero, descripcion, capacidad, precio, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const { rows } = await pool.query(query, [numero, descripcion, capacidad, precio, estado]);
    return rows[0];
  },

  // Función para actualizar una habitación
  updateHabitacion: async (id, numero, descripcion, capacidad, precio, estado) => {
    const query = 'UPDATE habitaciones SET numero = $1, descripcion = $2, capacidad = $3, precio = $4, estado = $5 WHERE id = $6 RETURNING *';
    const { rows } = await pool.query(query, [numero, descripcion, capacidad, precio, estado, id]);
    return rows[0];
  },

  // Función para eliminar una habitación
  deleteHabitacion: async (id) => {
    const query = 'DELETE FROM habitaciones WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

module.exports = Habitacion;

