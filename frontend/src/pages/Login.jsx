// controllers/authController.js
require('dotenv').config();
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const login = async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  try {
    // Validar reCAPTCHA con Google
    const { data } = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
      },
    });

    if (!data.success) {
      return res.status(400).json({ message: 'reCAPTCHA inválido' });
    }

    // Validar usuario
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!result.rows.length) return res.status(400).json({ message: 'Credenciales incorrectas' });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Error login:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { login };

