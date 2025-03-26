import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Reservas = () => {
  // Estados para vuelos y ciudades
  const [flights, setFlights] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  
  // Estados para la búsqueda
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  
  // Estados para vuelo seleccionado y reserva
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [category, setCategory] = useState("turista");
  const [segments, setSegments] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);

  // Obtener el rol del usuario (si es necesario para mostrar funciones de admin)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      // Aquí podrías usar setUserRole(decodedToken.role) si lo necesitas en el UI
    }
  }, []);

  // 🔹 Obtener ciudades disponibles desde el backend
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get("https://sistema-reservas-final.onrender.com/api/flights/cities");
  
        // Validamos que la respuesta sea un array y extraemos los nombres de las ciudades correctamente
        if (Array.isArray(res.data)) {
          const cities = res.data.map(item => item.city);
          console.log("📌 Ciudades cargadas:", cities); // 🔍 Verifica en la consola
          setAvailableCities(cities);
        } else {
          console.warn("⚠️ Respuesta inesperada de la API", res.data);
          setAvailableCities([]);
        }
      } catch (error) {
        console.error("❌ Error al obtener ciudades:", error);
        toast.error("❌ Error al obtener ciudades");
      }
    };
  
    fetchCities();
  }, []);

  // 🔹 Obtener todos los vuelos (lista completa)
  useEffect(() => {
    const fetchAllFlights = async () => {
      try {
        const res = await axios.get("https://sistema-reservas-final.onrender.com/api/flights");
        setFlights(res.data);
      } catch (error) {
        toast.error("❌ Error al obtener vuelos.");
      }
    };

    fetchAllFlights();
  }, []);

  // 🔍 Buscar vuelos por origen y destino
  const fetchFlights = async () => {
    if (!selectedOrigin || !selectedDestination) {
      toast.warning("⚠️ Selecciona una ciudad de origen y destino.");
      return;
    }
    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/flights/search?origin=${selectedOrigin}&destination=${selectedDestination}`
      );
      if (res.data.flights.length === 0 && res.data.segments.length === 0) {
        toast.warning("⚠️ No hay vuelos disponibles para esta ruta.");
      } else {
        toast.success("✅ Vuelos encontrados.");
      }
      setFilteredFlights(res.data.flights);
      setSegments(res.data.segments);
    } catch (error) {
      console.error("❌ Error al buscar vuelos:", error);
      toast.error("❌ Error al buscar vuelos.");
    }
  };

  // 🎫 Reservar vuelo seleccionado
  const handleBooking = async () => {
    if (!selectedFlight) {
      toast.warning("⚠️ Selecciona un vuelo primero");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      // Se envía el id del vuelo directo; si hay segmentos, se envían en "segments"
      const flightData = {
        flightId: selectedFlight.id,
        category,
        segments: segments.map(segment => ({
          flight_id: segment.id,
          origin: segment.origin,
          destination: segment.destination,
          departure_time: segment.departure_time,
          arrival_time: segment.arrival_time,
        }))
      };

      const res = await axios.post("https://sistema-reservas-final.onrender.com/api/bookings", flightData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Reserva exitosa. ¡Vamos a pagar!");
      setTimeout(() => (window.location.href = `/pago/${res.data.booking.id}`), 2000);
    } catch (error) {
      console.error("❌ Error al reservar el vuelo:", error);
      toast.error("❌ Error al reservar el vuelo");
    }
  };

  return (
    <div>
      <h2>✈️ Vuelos disponibles</h2>

      {/* 🔄 Alternar entre lista de vuelos y búsqueda */}
      <button onClick={() => setSearchMode(!searchMode)}>
        {searchMode ? "🔙 Volver a Lista de Vuelos" : "🔍 Buscar Vuelo por Ciudad"}
      </button>

      {searchMode ? (
        <div>
          <h3>Buscar Vuelo por Ciudad</h3>
          <label>Ciudad de Origen:</label>
          <select value={selectedOrigin} onChange={(e) => setSelectedOrigin(e.target.value)}>
            <option value="">Seleccione una ciudad</option>
            {availableCities.length > 0 ? (
              availableCities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))
            ) : (
              <option disabled>Cargando ciudades...</option>
            )}
          </select>

          <label>Ciudad de Destino:</label>
          <select value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)}>
            <option value="">Seleccione una ciudad</option>
            {availableCities.length > 0 ? (
              availableCities
                .filter(city => city !== selectedOrigin)
                .map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))
            ) : (
              <option disabled>Cargando ciudades...</option>
            )}
          </select>

          <button onClick={fetchFlights}>✈️ Buscar Vuelos</button>

          {/* 📌 Resultados de búsqueda */}
          {filteredFlights.length > 0 || segments.length > 0 ? (
            <div>
              {filteredFlights.map((flight, index) => (
                <div key={index} className="flight-card">
                  <h3>{`${flight.airline} - ${flight.origin} → ${flight.destination}`}</h3>
                  <p>Salida: {new Date(flight.departure_time).toLocaleString()}</p>
                  <p>💰 Precio: ${flight.price_turista}</p>
                  <button onClick={() => setSelectedFlight(flight)}>Seleccionar</button>
                </div>
              ))}
              {segments.length > 0 && (
                <div>
                  <h3>Tramos del vuelo seleccionado:</h3>
                  {segments.map((segment, index) => (
                    <div key={index} className="segment-card">
                      <p>{`${segment.airline} - ${segment.origin} → ${segment.destination}`}</p>
                      <p>Salida: {new Date(segment.departure_time).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p>No se encontraron vuelos</p>
          )}
        </div>
      ) : (
        // Modo lista de vuelos sin filtro
        <div>
          {flights.length > 0 ? (
            flights.map((flight, index) => (
              <div key={index} className="flight-card">
                <h3>{`${flight.airline} - ${flight.origin} → ${flight.destination}`}</h3>
                <p>Salida: {new Date(flight.departure_time).toLocaleString()}</p>
                <p>Precio Turista: ${flight.price_turista}</p>
                <p>Precio Business: ${flight.price_business}</p>
                <button onClick={() => setSelectedFlight(flight)}>Seleccionar</button>
              </div>
            ))
          ) : (
            <p>No hay vuelos disponibles en este momento</p>
          )}
        </div>
      )}

      {selectedFlight && <button onClick={handleBooking}>Reservar ahora</button>}

      {/* 🚪 Botón de cerrar sesión */}
      <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Reservas;