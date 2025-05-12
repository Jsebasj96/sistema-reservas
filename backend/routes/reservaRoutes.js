const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/',        reservaController.createReserva);
router.get('/',         reservaController.getAllReservas);
router.get('/:id',      reservaController.getReservaById);
router.delete('/:id',   reservaController.cancelReserva);

module.exports = router;


