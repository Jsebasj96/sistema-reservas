import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Reservas = () => {
  const [flights, setFlights] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [category, setCategory] = useState("turista");
  const [userRole, setUserRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [price, setPrice] = useState("");
  const [priceTurista, setPriceTurista] = useState("");
  const [priceBusiness, setPriceBusiness] = useState("");
  const [segments, setSegments] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);

  // 🟢 Obtener el rol del usuario desde el token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserRole(decodedToken.role);
    }
    fetchCities();
    fetchAllFlights();
  }, []);

  // 🔍 Obtener lista de ciudades disponibles desde la API
  const fetchCities = async () => {
    try {
        const res = await axios.get("https://sistema-reservas-final.onrender.com/api/flights/cities");
        setAvailableCities(res.data);
    } catch (error) {
        console.error("❌ Error al obtener ciudades:", error);
        toast.error("❌ Error al obtener ciudades");
    }
};

  // 🛫 Obtener todos los vuelos sin filtros (lista completa)
  const fetchAllFlights = async () => {
    try {
      const res = await axios.get("https://sistema-reservas-final.onrender.com/api/flights");
      setFlights(res.data);
    } catch (error) {
      toast.error("❌ Error al obtener vuelos.");
    }
  };

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
      const flightData = {
        flightId: selectedFlight.tramos ? selectedFlight.tramos[0].id : selectedFlight.id,
        category,
        segments: selectedFlight.tramos
          ? selectedFlight.tramos.map(tramo => ({
              flight_id: tramo.id,
              origin: tramo.origin,
              destination: tramo.destination,
              departure_time: tramo.departure_time,
              arrival_time: tramo.arrival_time,
            }))
          : []
      };

      const res = await axios.post("https://sistema-reservas-final.onrender.com/api/bookings", flightData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Reserva exitosa. ¡Vamos a pagar!");
      setTimeout(() => (window.location.href = `/pago/${res.data.booking.id}`), 2000);
    } catch (error) {
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
            {availableCities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>

          <label>Ciudad de Destino:</label>
          <select value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)}>
            <option value="">Seleccione una ciudad</option>
            {availableCities.filter(city => city !== selectedOrigin).map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>

          <button onClick={fetchFlights}>✈️ Buscar Vuelos</button>

          {/* 📌 Resultados de búsqueda */}
          {filteredFlights.length > 0 ? (
            filteredFlights.map((flight, index) => (
              <div key={index} className="flight-card">
                <h3>{`${flight.airline} - ${flight.origin} → ${flight.destination}`}</h3>
                <p>Salida: {new Date(flight.departure_time).toLocaleString()}</p>
                <p>💰 Precio: ${flight.price_turista}</p>
                <button onClick={() => setSelectedFlight(flight)}>Seleccionar</button>
              </div>
            ))
          ) : (
            <p>No se encontraron vuelos</p>
          )}
        </div>
      ) : (
        /* 🛫 Modo lista de vuelos normales */
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

      {selectedFlight && (
        <div className="booking-options">
          <h3>Reserva tu vuelo</h3>
          <label>Categoría:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="turista">Turista</option>
            <option value="business">Business</option>
          </select>
          <button onClick={handleBooking}>Reservar ahora</button>
        </div>
      )}

      {/* 🚪 Botón de cerrar sesión */}
      <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Reservas;