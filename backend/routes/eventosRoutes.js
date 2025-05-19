const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, eventosController.createEvento);
router.get('/', verifyToken, eventosController.getAllEventos);

module.exports = router;
