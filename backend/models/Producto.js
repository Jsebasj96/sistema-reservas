const pool = require('../config/db');  // Conexión a la base de datos

const Producto = {
  // Función para obtener todos los productos
  getAllProductos: async () => {
    const query = 'SELECT * FROM inventario_productos';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Función para obtener un producto por ID
  getProductoById: async (id) => {
    const query = 'SELECT * FROM inventario_productos WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Función para crear un nuevo producto
  createProducto: async (nombre, descripcion, precio, cantidad) => {
    const query = 'INSERT INTO inventario_productos (nombre, descripcion, precio, cantidad) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await pool.query(query, [nombre, descripcion, precio, cantidad]);
    return rows[0];
  },

  // Función para actualizar un producto
  updateProducto: async (id, nombre, descripcion, precio, cantidad) => {
    const query = 'UPDATE inventario_productos SET nombre = $1, descripcion = $2, precio = $3, cantidad = $4 WHERE id = $5 RETURNING *';
    const { rows } = await pool.query(query, [nombre, descripcion, precio, cantidad, id]);
    return rows[0];
  },

  // Función para eliminar un producto
  deleteProducto: async (id) => {
    const query = 'DELETE FROM inventario_productos WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

module.exports = Producto;

