const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Guardar la información del usuario decodificado
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Acceso denegado. Token inválido.' });
  }
};

module.exports = { verifyToken };

