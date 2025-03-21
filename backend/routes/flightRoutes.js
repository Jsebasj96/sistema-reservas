const express = require('express');
const { check, validationResult } = require('express-validator');
const { getAllFlights, getFlightById, createFlight } = require('../models/Flight');
const verifyToken = require('../middlewares/authMiddleware');
const { verifyAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router();

// ✅ Ruta pública para obtener todos los vuelos
router.get('/', async (req, res) => {
  try {
    const flights = await getAllFlights();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los vuelos' });
  }
});

// ✅ Ruta pública para obtener un vuelo por ID
router.get('/:id', async (req, res) => {
  try {
    const flight = await getFlightById(req.params.id);
    if (!flight) return res.status(404).json({ error: 'Vuelo no encontrado' });
    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el vuelo' });
  }
});

// 🔒 Ruta protegida para crear un nuevo vuelo (solo administradores)
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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