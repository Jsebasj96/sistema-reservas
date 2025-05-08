const pool = require('../config/db');

const agregarProductoInventario = async (req, res) => {
  const { nombre, cantidad, precio } = req.body;

  const nuevoProducto = await pool.query(
    'INSERT INTO inventario_productos (nombre, cantidad, precio) VALUES ($1, $2, $3) RETURNING *',
    [nombre, cantidad, precio]
  );

  res.status(201).json({ message: 'Producto agregado al inventario', producto: nuevoProducto.rows[0] });
};

const actualizarInventarioProducto = async (req, res) => {
  const { productoId, cantidad } = req.body;

  const productoActualizado = await pool.query(
    'UPDATE inventario_productos SET cantidad = $1 WHERE id = $2 RETURNING *',
    [cantidad, productoId]
  );

  res.json({ message: 'Producto actualizado en el inventario', producto: productoActualizado.rows[0] });
};

module.exports = {
  agregarProductoInventario,
  actualizarInventarioProducto,
};
