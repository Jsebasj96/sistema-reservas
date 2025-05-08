const express = require('express');
const router = express.Router();
const pasadiaController = require('../controllers/pasadiaController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para reservar un pasadía
router.post('/', authMiddleware.verifyToken, pasadiaController.createPasadia);

// Ruta para obtener los pasadías disponibles
router.get('/', authMiddleware.verifyToken, pasadiaController.getPasadias);

module.exports = router;
