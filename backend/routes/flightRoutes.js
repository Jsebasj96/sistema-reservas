const express = require("express");
const { check, validationResult } = require("express-validator");
const { 
  getAllFlights, 
  getFlightById, 
  createFlight, 
  updateFlight, 
  deleteFlight 
} = require("../models/Flight");
const verifyToken = require("../middlewares/authMiddleware");
const { verifyAdmin } = require("../middlewares/roleMiddleware");
const { getAvailableCities } = require("../models/Flight");
const { findFlightsWithConnections } = require("../models/Flight");
const pool = require("../config/db");

const router = express.Router();

/**
 * ✅ Obtener todos los vuelos (Público)
 */
router.get("/", async (req, res) => {
  try {
    const flights = await getAllFlights();
    res.json(flights);
  } catch (error) {
    console.error("❌ Error al obtener los vuelos:", error);
    res.status(500).json({ error: "Error al obtener los vuelos" });
  }
});

/**
 * 🔍 Buscar vuelos con conexiones
 * ⚠️ NOTA: Esta ruta debe ir antes de la de obtener vuelo por ID
 */
router.get("/search", async (req, res) => {
  try {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ error: "Debes proporcionar origen y destino" });
    }

    // 🔍 Convertir ciudades a códigos IATA
    const getIATA = async (city) => {
      const result = await pool.query("SELECT iata_code FROM airports WHERE city = $1", [city]);
      return result.rows.length > 0 ? result.rows[0].iata_code : null;
    };

    const originIATA = await getIATA(origin);
    const destinationIATA = await getIATA(destination);

    if (!originIATA || !destinationIATA) {
      return res.status(404).json({ error: "No se encontraron aeropuertos para las ciudades ingresadas" });
    }

    // 🔥 Buscar vuelos con conexión
    const result = await findFlightsWithConnections(originIATA, destinationIATA);
    res.json(result);

  } catch (error) {
    console.error("❌ Error al obtener vuelos:", error);
    res.status(500).json({ error: "Error al obtener vuelos" });
  }
});

/**
 * ✅ Obtener un vuelo por ID (Debe ir después para no chocar con /search)
 */
router.get("/:id", async (req, res) => {
  const flightId = parseInt(req.params.id, 10); // Convertimos a número seguro

  if (isNaN(flightId)) {
    return res.status(400).json({ error: "ID de vuelo inválido" });
  }

  try {
    const flight = await getFlightById(flightId);
    if (!flight) return res.status(404).json({ error: "Vuelo no encontrado" });

    res.json(flight);
  } catch (error) {
    console.error("❌ Error al obtener el vuelo:", error);
    res.status(500).json({ error: "Error al obtener el vuelo" });
  }
});

/**
 * 🔒 Crear un nuevo vuelo (Solo administradores)
 */
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  [
    check("airline", "El nombre de la aerolínea es obligatorio").not().isEmpty(),
    check("origin", "El origen es obligatorio").not().isEmpty(),
    check("destination", "El destino es obligatorio").not().isEmpty(),
    check("departure_time", "Debe ser una fecha válida de salida").isISO8601(),
    check("arrival_time", "Debe ser una fecha válida de llegada").isISO8601(),
    check("price", "El precio debe ser un número positivo").isFloat({ gt: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { airline, origin, destination, departure_time, arrival_time, price } = req.body;

      // ✅ Calcular precios automáticamente
      const price_turista = parseFloat(price).toFixed(2);
      const price_business = (parseFloat(price) * 1.12).toFixed(2);

      const newFlight = await createFlight(
        airline, origin, destination, departure_time, arrival_time, price_turista, price_business
      );

      res.status(201).json({ message: "Vuelo creado con éxito", flight: newFlight });
    } catch (error) {
      console.error("❌ Error al crear el vuelo:", error);
      res.status(500).json({ error: "Error al crear el vuelo" });
    }
  }
);

/**
 * 🔄 Actualizar un vuelo (Solo administradores)
 */
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  [
    check("airline", "El nombre de la aerolínea es obligatorio").optional().not().isEmpty(),
    check("origin", "El origen es obligatorio").optional().not().isEmpty(),
    check("destination", "El destino es obligatorio").optional().not().isEmpty(),
    check("departure_time", "Debe ser una fecha válida de salida").optional().isISO8601(),
    check("arrival_time", "Debe ser una fecha válida de llegada").optional().isISO8601(),
    check("price", "El precio debe ser un número positivo").optional().isFloat({ gt: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { price } = req.body;

      // ✅ Si se actualiza el precio, recalcular price_turista y price_business
      if (price) {
        req.body.price_turista = parseFloat(price).toFixed(2);
        req.body.price_business = (parseFloat(price) * 1.12).toFixed(2);
      }

      const updatedFlight = await updateFlight(req.params.id, req.body);
      if (!updatedFlight) {
        return res.status(404).json({ error: "Vuelo no encontrado" });
      }

      res.json({ message: "Vuelo actualizado con éxito", flight: updatedFlight });
    } catch (error) {
      console.error("❌ Error al actualizar el vuelo:", error);
      res.status(500).json({ error: "Error al actualizar el vuelo" });
    }
  }
);

/**
 * ❌ Eliminar un vuelo (Solo administradores)
 */
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedFlight = await deleteFlight(req.params.id);
    if (!deletedFlight) {
      return res.status(404).json({ error: "Vuelo no encontrado" });
    }

    res.json({ message: "Vuelo eliminado con éxito" });
  } catch (error) {
    console.error("❌ Error al eliminar el vuelo:", error);
    res.status(500).json({ error: "Error al eliminar el vuelo" });
  }
});

/**
 * ✅ Obtener las ciudades disponibles (origen y destino)
 */
router.get("/cities", async (req, res) => {
  try {
    const cities = await getAvailableCities();
    res.json(cities);
  } catch (error) {
    console.error("❌ Error al obtener las ciudades:", error);
    res.status(500).json({ error: "Error al obtener las ciudades" });
  }
});

// ✅ Nueva ruta: Buscar vuelos con o sin escalas
router.get("/search", async (req, res) => {
  const { origin, destination } = req.query;
  
  console.log(`🌍 Origen recibido en API: '${origin}'`);
  console.log(`🌍 Destino recibido en API: '${destination}'`);

  if (!origin || !destination) {
      return res.status(400).json({ error: "Debes proporcionar origen y destino" });
  }

  try {
      const flights = await findFlightsWithConnections(origin, destination);
      res.json(flights);
  } catch (error) {
      console.error("❌ Error al buscar vuelos:", error);
      res.status(500).json({ error: "Error al obtener vuelos" });
  }
});

module.exports = router;