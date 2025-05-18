require('dotenv').config();
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const axios = require('axios');

const register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const exists = await pool.query('SELECT 1 FROM users WHERE email=$1', [email]);
    if (exists.rows.length) return res.status(400).json({ error: 'Usuario ya existe' });
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users(email,password,name,role) VALUES($1,$2,$3,$4) RETURNING id,email,name,role',
      [email, hash, name, 'user']
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error('Error en register:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const login = async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ error: 'Falta el token de reCAPTCHA' });
  }

  try {
    // 1. Verificar token de reCAPTCHA con Google
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    const response = await axios.post(verifyURL);
    const { success, score } = response.data;

    if (!success) {
      return res.status(400).json({ error: 'reCAPTCHA inválido' });
    }

    // Opcional: puedes exigir un "score" mínimo si usas reCAPTCHA v3 (tú estás usando v2, así que no es obligatorio)

    // 2. Autenticación normal
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!result.rows.length) return res.status(400).json({ error: 'Credenciales incorrectas' });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Aquí podrías usar cookies si ya estás manejando sesiones
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,         // obligatorio en https (Render)
      sameSite: "none",     // obligatorio si frontend está en otro dominio (como Vercel)
      maxAge: 24 * 60 * 60 * 1000 // 1 día
      })
      .status(200)
      .json({
        id:    user.id,
        email: user.email,
        role:  user.role
    });
    res.json({ message: "Login exitoso" });

  } catch (err) {
    console.error('Error al verificar reCAPTCHA o login:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await pool.query('SELECT id,email,name,role FROM users WHERE id=$1', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { register, login, getProfile };
