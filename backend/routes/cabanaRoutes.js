// routes/cabanaRoutes.js
const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, capacidad, estado, precio_por_noche
       FROM "cabañas"
       WHERE estado = 'Disponible'`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cabañas' });
  }
});

module.exports = router;


