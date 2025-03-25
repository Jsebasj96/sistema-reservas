const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      console.error("❌ Error: No se encontró información del usuario en la solicitud.");
      return res.status(401).json({ message: "No autorizado. Usuario no identificado." });
    }

    console.log("🔍 Rol del usuario:", req.user.role); // Debugging

    if (req.user.role !== "admin") {
      console.warn("⛔ Acceso denegado. Se requieren permisos de administrador.");
      return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de administrador." });
    }

    next(); // ✅ Usuario es admin, continuar con la solicitud
  } catch (error) {
    console.error("❌ Error en la verificación de rol:", error);
    res.status(500).json({ message: "Error interno en la verificación de permisos." });
  }
};

module.exports = { verifyAdmin };