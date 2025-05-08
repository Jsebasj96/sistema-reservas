require('dotenv').config();  // Asegúrate de cargar las variables de entorno

const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// No necesitas importar 'constants' si estás usando el archivo .env
// const constants = require('../config/constants'); // Puedes omitir esta línea

const register = async (req, res) => {
  const { email, password, name } = req.body;

  // Verificar si el usuario ya existe
  const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userExists.rows.length > 0) {
    return res.status(400).json({ error: 'El usuario ya existe' });
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insertar usuario en la base de datos
  const newUser = await pool.query(
    'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
    [email, hashedPassword, name]
  );

  res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser.rows[0] });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Verificar si el usuario existe
  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (user.rows.length === 0) {
    return res.status(400).json({ error: 'Credenciales incorrectas' });
  }

  // Comparar contraseñas
  const isMatch = await bcrypt.compare(password, user.rows[0].password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Credenciales incorrectas' });
  }

  // Generar JWT usando la variable de entorno JWT_SECRET
  const token = jwt.sign(
    { id: user.rows[0].id, role: user.rows[0].role }, 
    process.env.JWT_SECRET || 'secret', // Usa la variable de entorno JWT_SECRET (definida en .env)
    { expiresIn: '1h' }
  );

  res.json({ message: 'Inicio de sesión exitoso', token });
};

module.exports = {
  register,
  login,
};
