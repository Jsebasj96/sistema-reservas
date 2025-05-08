const pool = require('../config/db');

const crearPasadia = async (req, res) => {
  const { userId, fecha, tipoPasadia, total } = req.body;

  // Insertar el pasadía en la base de datos
  const nuevoPasadia = await pool.query(
    'INSERT INTO pasadias (user_id, fecha, tipo_pasadia, total) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, fecha, tipoPasadia, total]
  );

  res.status(201).json({ message: 'Pasadía creado exitosamente', pasadia: nuevoPasadia.rows[0] });
};

const getPasadiasByUser = async (req, res) => {
  const { userId } = req.params;

  const pasadias = await pool.query('SELECT * FROM pasadias WHERE user_id = $1', [userId]);

  res.json({ pasadias: pasadias.rows });
};

module.exports = {
  crearPasadia,
  getPasadiasByUser,
};
