// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');  // <-- destructura aquí

// Registro
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Perfil (protección con verifyToken)
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;

