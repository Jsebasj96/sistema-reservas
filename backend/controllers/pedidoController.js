// controllers/pedidoController.js
const pool = require('../config/db');

const createPedido = async (req, res) => {
  const {
    usuario_id,
    producto_id,
    nombre_producto,
    cantidad,
    precio_unitario,
    total,
    tipo,         // 'desayuno' | 'almuerzo' | 'bar'
    categoria,    // mismo valor que tipo, o más fino ('hospedaje', 'pasadia', etc.)
    habitacion_id // opcional para cargar a habitación/cabaña
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO pedidos
        (usuario_id, producto_id, nombre_producto, cantidad,
         precio_unitario, total, tipo, categoria, habitacion_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
       RETURNING *`,
      [
        usuario_id,
        producto_id,
        nombre_producto,
        cantidad,
        precio_unitario,
        total,
        tipo,
        categoria,
        habitacion_id || null
      ]
    );
    res.status(201).json({ pedido: result.rows[0] });
  } catch (err) {
    console.error('Error al crear pedido:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getAllPedidos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM pedidos ORDER BY created_at DESC`
    );
    res.json({ pedidos: result.rows });
  } catch (err) {
    console.error('Error al obtener pedidos:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Opcional: reporte de totales por categoría
const getIngresosPorCategoria = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT categoria, SUM(total) AS ingreso_total
       FROM pedidos
       GROUP BY categoria`
    );
    res.json({ ingresos: result.rows });
  } catch (err) {
    console.error('Error al obtener ingresos por categoría:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = {
  createPedido,
  getAllPedidos,
  getIngresosPorCategoria
};
