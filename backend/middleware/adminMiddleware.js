const adminMiddleware = (req, res, next) => {
  const user = req.user;

  // Verificar si el usuario tiene rol 'admin'
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. No eres administrador.' });
  }

  next();
};

module.exports = adminMiddleware;

