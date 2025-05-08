const pool = require('../config/db');

const createPasadia = async (req, res) => {
  const { clienteId, tipo, incluyeAlmuerzo } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO pasadias (user_id,tipo,almuerzo,fecha)
       VALUES ($1,$2,$3,NOW()) RETURNING *`,
      [clienteId, tipo, incluyeAlmuerzo]
    );
    res.status(201).json({ pasadia: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getAllPasadias = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pasadias ORDER BY fecha DESC');
    res.json({ pasadias: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { createPasadia, getAllPasadias };
