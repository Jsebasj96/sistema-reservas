const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta de registro
router.post('/register', authController.register);

// Ruta de login
router.post('/login', authController.login);

// Ruta de obtener perfil (requiere autenticación)
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);

module.exports = router;
