const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ message: 'Acceso denegado. No hay token.' });

  try {
    // Si el token tiene formato "Bearer TOKEN", hay que extraer solo el token
    const tokenParts = token.split(' ');
    const authToken = tokenParts.length === 2 ? tokenParts[1] : token;

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = decoded; // Ahora req.user tendrá userId y role

    console.log('Usuario autenticado:', req.user); // Debugging

    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido.' });
  }
};

module.exports = verifyToken;