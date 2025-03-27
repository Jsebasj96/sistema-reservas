import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BusquedaVuelos from "./BusquedaVuelos"; // ✅ Importamos el nuevo componente

const Reservas = () => {
  const [flights, setFlights] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [category, setCategory] = useState("turista");
  const [segments, setSegments] = useState([]);

  // 🔹 Obtener todos los vuelos
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

  // 🎫 Reservar vuelo seleccionado
  const handleBooking = async () => {
    if (!selectedFlight) {
      toast.warning("⚠️ Selecciona un vuelo primero");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const flightData = {
        flightId: selectedFlight.id,
        category,
        segments: segments.map((segment) => ({
          flight_id: segment.id,
          origin: segment.origin,
          destination: segment.destination,
          departure_time: segment.departure_time,
          arrival_time: segment.arrival_time,
        })),
      };

      const res = await axios.post("https://sistema-reservas-final.onrender.com/api/bookings", flightData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Reserva exitosa. ¡Vamos a pagar!");
      setTimeout(() => (window.location.href = `/pago/${res.data.booking.id}`), 2000);
    } catch (error) {
      console.error("❌ Error al reservar el vuelo:", error);
      toast.error("❌ No se pudo realizar la reserva.");
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
        <BusquedaVuelos setSelectedFlight={setSelectedFlight} setSegments={setSegments} />
      ) : (
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
      <button onClick={() => localStorage.removeItem("token") || (window.location.href = "/")}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Reservas;