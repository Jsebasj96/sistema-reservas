const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, reservaController.createReserva);
router.get('/', verifyToken, reservaController.getAllReservas);
router.get('/:id', verifyToken, reservaController.getReservaById);
router.delete('/:id', verifyToken, reservaController.cancelReserva);

module.exports = router;


