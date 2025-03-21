import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Reservas = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [category, setCategory] = useState("turista");

  // 🔥 Cargar los vuelos desde el backend
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get("https://sistema-reservas-final.onrender.com/api/flights");
        setFlights(res.data);
      } catch (error) {
        toast.error("Error cargando vuelos");
      }
    };
    fetchFlights();
  }, []);

  // ✈️ Manejar la reserva
  const handleBooking = async () => {
    if (!selectedFlight) {
      toast.warning("Selecciona un vuelo primero");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://sistema-reservas-final.onrender.com/api/bookings",
        {
          flightId: selectedFlight.id,
          category,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      toast.success("✅ Reserva exitosa. ¡Vamos a pagar!");
      setTimeout(() => window.location.href = `/pago/${res.data.booking.id}`, 2000);
    } catch (error) {
      toast.error("Error al reservar el vuelo");
    }
  };

  // 🔥 Renderizar la lista de vuelos disponibles
  return (
    <div>
      <h2>✈️ Vuelos disponibles</h2>

      {flights.length > 0 ? (
        flights.map((flight) => (
          <div key={flight.id} className="flight-card">
            <h3>{`${flight.airline} - ${flight.origin} → ${flight.destination}`}</h3>
            <p>Salida: {new Date(flight.departure_time).toLocaleString()}</p>
            <p>Precio: ${flight.price}</p>
            <button onClick={() => setSelectedFlight(flight)}>Seleccionar</button>
          </div>
        ))
      ) : (
        <p>No hay vuelos disponibles en este momento</p>
      )}

      {/* 🔥 Si hay un vuelo seleccionado, mostramos la opción de categoría */}
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

      {/* Botón de cerrar sesión */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Reservas;