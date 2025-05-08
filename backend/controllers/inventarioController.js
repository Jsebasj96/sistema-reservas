const pool = require('../config/db');

const getProductos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventario_productos');
    res.json({ productos: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getServicios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventario_servicios_mesa');
    res.json({ servicios: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { getProductos, getServicios };