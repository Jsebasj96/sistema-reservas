const jwt = require('jsonwebtoken');

// Función para generar un token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET_KEY, // Asegúrate de tener una clave secreta en el .env
        { expiresIn: '1h' } // El token expirará en 1 hora
    );
};

module.exports = generateToken;
