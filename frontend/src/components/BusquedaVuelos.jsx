import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BusquedaVuelos = ({ setSelectedFlight, setSegments }) => {
  const [availableCities, setAvailableCities] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [filteredFlights, setFilteredFlights] = useState([]);

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
        toast.error("❌ No se pudieron cargar las ciudades.");
      }
    };
    fetchCities();
  }, []);

  // ✅ Buscar vuelos directos o con escalas
  const fetchFlights = async () => {
    if (!selectedOrigin || !selectedDestination) {
      toast.warning("⚠️ Selecciona una ciudad de origen y destino.");
      return;
    }
  
    try {
      console.log("🔍 Buscando vuelos de:", selectedOrigin, "a", selectedDestination);
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/flights/search?origin=${selectedOrigin}&destination=${selectedDestination}`
      );
  
      // ✅ Validamos la estructura de la respuesta
      if (!res.data || !Array.isArray(res.data.flights)) {
        console.error("❌ Respuesta de la API inesperada:", res.data);
        throw new Error("Estructura de datos incorrecta.");
      }
  
      if (res.data.flights.length > 0) {
        console.log("✅ Vuelos directos encontrados:", res.data.flights);
        setFilteredFlights(res.data.flights); 
        setSegments([]); 
        toast.success("✅ Vuelos directos encontrados.");
      } else {
        console.log("❌ No hay vuelos directos, buscando rutas con escalas...");
        await findConnectingFlights(selectedOrigin, selectedDestination); // ✅ Aseguramos que se usa `await`
      }
    } catch (error) {
      console.error("❌ Error al buscar vuelos:", error);
      toast.error("❌ No se pudieron buscar vuelos.");
    }
  };

  // 🔄 Buscar rutas con escalas
  const findConnectingFlights = async (origin, destination) => {
    try {
      console.log("🔍 Buscando rutas con escalas...");
      const res = await axios.get(`https://sistema-reservas-final.onrender.com/api/flights`);
      const allFlights = res.data;
  
      if (!Array.isArray(allFlights)) {
        throw new Error("Estructura incorrecta de datos en vuelos.");
      }
  
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
        const bestRoute = possibleRoutes.sort((a, b) => a.length - b.length)[0];
        console.log("🛫 Ruta con escalas encontrada:", bestRoute);
  
        setFilteredFlights(bestRoute); // ✅ Guardamos todos los vuelos en la ruta
        setSegments(bestRoute.slice(1)); // ✅ Guardamos las escalas
        toast.success(`✅ Ruta con ${bestRoute.length} tramo(s) encontrada.`);
      } else {
        toast.error("❌ No se encontraron rutas con escalas.");
      }
    } catch (error) {
      console.error("❌ Error buscando rutas con escalas:", error);
      toast.error("❌ No se pudo encontrar una ruta.");
    }
  };

  // 🔙 Volver a reservas
  const volverAReservas = () => {
    window.location.href = "/reservas"; 
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

      {/* ✅ Botón de búsqueda */}
      <button onClick={fetchFlights}> Buscar Vuelos</button>

      {/* 📌 Mostrar resultados */}
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

      {/* 🔙 Botón para volver a la página de reservas */}
      <button onClick={volverAReservas} style={{ marginTop: "20px", backgroundColor: "#f44336", color: "white" }}>
        ⬅️ Volver a Reservas
      </button>
    </div>
  );
};

export default BusquedaVuelos;