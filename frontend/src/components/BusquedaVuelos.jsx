import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BusquedaVuelos = ({ setSelectedFlight, setSegments }) => {
  const [availableCities, setAvailableCities] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [filteredFlights, setFilteredFlights] = useState([]);

  // 🔹 Obtener ciudades disponibles
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://sistema-reservas-final.onrender.com/api/flights/cities"
        );
        if (Array.isArray(response.data)) {
          const citiesList = response.data.map((item) => item.city);
          setAvailableCities(citiesList);
        } else {
          toast.error("❌ Error al obtener ciudades.");
        }
      } catch (error) {
        console.error("❌ Error al obtener ciudades:", error);
        toast.error("❌ Error al obtener ciudades.");
      }
    };
    fetchCities();
  }, []);

  // 🔍 Buscar vuelos (directo o por tramos)
  const fetchFlights = async () => {
    if (!selectedOrigin || !selectedDestination) {
      toast.warning("⚠️ Selecciona una ciudad de origen y destino.");
      return;
    }

    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/flights/search?origin=${selectedOrigin}&destination=${selectedDestination}`
      );

      if (res.data.flights.length > 0) {
        // ✅ Si hay vuelo directo, lo mostramos
        setFilteredFlights(res.data.flights);
        setSegments([]); // No hay tramos si el vuelo es directo
        toast.success("✅ Vuelos encontrados.");
      } else {
        // ❌ No hay vuelo directo, buscar rutas con escalas
        findConnectingFlights(selectedOrigin, selectedDestination);
      }
    } catch (error) {
      console.error("❌ Error al buscar vuelos:", error);
      toast.error("❌ No se pudieron buscar vuelos.");
    }
  };

  // 🔄 Buscar vuelos con escalas automáticamente
  const findConnectingFlights = async (origin, destination) => {
    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/flights`
      );
      const allFlights = res.data;

      let possibleRoutes = [];
      let visited = new Set();

      const findRoutes = (current, path) => {
        if (current === destination) {
          possibleRoutes.push([...path]);
          return;
        }
        visited.add(current);

        allFlights
          .filter((f) => f.origin === current && !visited.has(f.destination))
          .forEach((nextFlight) => {
            findRoutes(nextFlight.destination, [...path, nextFlight]);
          });

        visited.delete(current);
      };

      findRoutes(origin, []);

      if (possibleRoutes.length > 0) {
        // 🛫 Tomamos la ruta más corta
        const bestRoute = possibleRoutes.sort((a, b) => a.length - b.length)[0];
        setFilteredFlights([bestRoute[0]]); // Tomamos el primer vuelo como "principal"
        setSegments(bestRoute.slice(1)); // Los demás son tramos
        toast.success(`✅ Ruta con ${bestRoute.length} tramo(s) encontrada.`);
      } else {
        toast.error("❌ No se encontraron rutas con escalas.");
      }
    } catch (error) {
      console.error("❌ Error buscando rutas con escalas:", error);
      toast.error("❌ No se pudo encontrar una ruta.");
    }
  };

  return (
    <div>
      <h3>🔍 Buscar Vuelo por Ciudad</h3>

      <label>Ciudad de Origen:</label>
      <select value={selectedOrigin} onChange={(e) => setSelectedOrigin(e.target.value)}>
        <option value="">Seleccione una ciudad</option>
        {availableCities.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
      </select>

      <label>Ciudad de Destino:</label>
      <select value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)}>
        <option value="">Seleccione una ciudad</option>
        {availableCities
          .filter((city) => city !== selectedOrigin)
          .map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
      </select>

      <button onClick={fetchFlights}>✈️ Buscar Vuelos</button>

      {/* 📌 Mostrar resultados de búsqueda */}
      {filteredFlights.length > 0 && (
        <div>
          {filteredFlights.map((flight, index) => (
            <div key={index} className="flight-card">
              <h3>{`${flight.airline} - ${flight.origin} → ${flight.destination}`}</h3>
              <p>Salida: {new Date(flight.departure_time).toLocaleString()}</p>
              <p>💰 Precio: ${flight.price_turista}</p>
              <button onClick={() => setSelectedFlight(flight)}>Seleccionar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusquedaVuelos;