const verifyAdmin = (req, res, next) => {
  console.log('Rol del usuario:', req.user.role); // Debugging

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
};

module.exports = { verifyAdmin };