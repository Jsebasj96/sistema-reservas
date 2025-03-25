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
 * ✅ Obtener un vuelo por ID (Público)
 */
router.get("/:id", async (req, res) => {
  try {
    const flight = await getFlightById(req.params.id);
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
      const newFlight = await createFlight(airline, origin, destination, departure_time, arrival_time, price);

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

module.exports = router;