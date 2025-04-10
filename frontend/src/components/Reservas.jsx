import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Reservas = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [category, setCategory] = useState("turista");
  const [segments, setSegments] = useState([]);
  const [userRole, setUserRole] = useState(null); // ✅ Nuevo: rol del usuario
  const [showForm, setShowForm] = useState(false); // ✅ Mostrar/ocultar formulario admin
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  // ✅ Obtener rol del usuario desde el token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUserRole(decoded.role);
    }
  }, []);

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
        price: category === "business" ? selectedFlight.price_business : selectedFlight.price_turista,
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

  // ✅ Crear nuevo vuelo (solo admin)
  const handleCreateFlight = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const newFlight = {
      airline: e.target.airline.value,
      origin: e.target.origin.value,
      destination: e.target.destination.value,
      departure_time: e.target.departure_time.value,
      arrival_time: e.target.arrival_time.value,
      price: price,
    };

    try {
      await axios.post("https://sistema-reservas-final.onrender.com/api/flights", newFlight, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Vuelo creado con éxito");
      setShowForm(false);
      e.target.reset();
    } catch (error) {
      toast.error("❌ Error al crear el vuelo");
    }
  };

  return (
    <div>
      <h2>✈️ Vuelos disponibles</h2>

      <button onClick={() => navigate("/busqueda-vuelos")}>Buscar Vuelo por Ciudad</button>

      <div>
        {flights.length > 0 ? (
          flights.map((flight, index) => (
            <div
              key={index}
              className="flight-card"
              style={{
                border: selectedFlight?.id === flight.id ? "3px solid green" : "1px solid #ccc",
                padding: "10px",
                margin: "10px",
                borderRadius: "5px",
              }}
            >
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

      {selectedFlight && (
        <div>
          <h3>Selecciona la categoría de tu boleto:</h3>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="turista">Turista - ${selectedFlight.price_turista}</option>
            <option value="business">Business - ${selectedFlight.price_business}</option>
          </select>
          <button onClick={handleBooking}>Reservar ahora</button>
        </div>
      )}

      {/* ✅ Mostrar formulario de creación de vuelos si es admin */}
      {userRole === "admin" && (
        <>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancelar" : "➕ Crear Nuevo Vuelo"}
          </button>

          {showForm && (
            <form onSubmit={handleCreateFlight}>
              <label>Aerolínea:</label>
              <input type="text" name="airline" required />
              <label>Origen:</label>
              <input type="text" name="origin" required />
              <label>Destino:</label>
              <input type="text" name="destination" required />
              <label>Hora de salida:</label>
              <input type="datetime-local" name="departure_time" required />
              <label>Hora de llegada:</label>
              <input type="datetime-local" name="arrival_time" required />
              <label>Precio base:</label>
              <input
                type="number"
                step="0.01"
                name="price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <button type="submit">✈️ Crear Vuelo</button>
            </form>
          )}
        </>
      )}

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
