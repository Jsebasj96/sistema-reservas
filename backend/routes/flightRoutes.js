const express = require('express');
const { check, validationResult } = require('express-validator');
const { getAllFlights, getFlightById, createFlight } = require('../models/Flight');
const verifyToken = require('../middlewares/authMiddleware');
const { verifyAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Crear un nuevo vuelo (🔒 Solo administradores)
router.post(
  '/',
  verifyToken,
  verifyAdmin,
  [
    check('airline', 'El nombre de la aerolínea es obligatorio').not().isEmpty(),
    check('origin', 'El origen es obligatorio').not().isEmpty(),
    check('destination', 'El destino es obligatorio').not().isEmpty(),
    check('departure_time', 'Debe ser una fecha válida de salida').isISO8601(),
    check('arrival_time', 'Debe ser una fecha válida de llegada').isISO8601(),
    check('price', 'El precio debe ser un número positivo').isFloat({ gt: 0 })
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  async (req, res) => {
    const { airline, origin, destination, departure_time, arrival_time, price } = req.body;
    try {
      const newFlight = await createFlight(airline, origin, destination, departure_time, arrival_time, price);
      res.status(201).json({ message: 'Vuelo creado con éxito', flight: newFlight });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;

// Crear un nuevo vuelo (🔒 Solo administradores)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { airline, origin, destination, departure_time, arrival_time, price } = req.body;
  try {
    const newFlight = await createFlight(airline, origin, destination, departure_time, arrival_time, price);
    res.status(201).json({ message: 'Vuelo creado con éxito', flight: newFlight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;