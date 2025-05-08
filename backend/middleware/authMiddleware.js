const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // El payload del token (datos del usuario) se coloca en req.user
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Acceso denegado. Token inválido.' });
  }
};

module.exports = authMiddleware;
