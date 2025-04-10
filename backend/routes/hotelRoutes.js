const express = require("express");
const { getHotelsByCity } = require("../models/Hotel");

const router = express.Router();

// Obtener hoteles disponibles en una ciudad
router.get("/", async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "La ciudad es obligatoria" });

  try {
    const hotels = await getHotelsByCity(city);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los hoteles" });
  }
});

module.exports = router;
