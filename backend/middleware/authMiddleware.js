// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  // Primero intenta sacarlo del header (opcional)
  let token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('>>> authMiddleware req.cookies =', req.cookies);

  // Si no viene en header, lo tomamos de la cookie "token"
  if (!token && req.cookies) {
    token = req.cookies.token; 
  }

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Acceso denegado. Token inválido.' });
  }
};

module.exports = { verifyToken };


