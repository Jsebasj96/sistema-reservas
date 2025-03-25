import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Reservas = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [category, setCategory] = useState("turista");
  const [userRole, setUserRole] = useState(null); // ⬅️ Estado para almacenar el rol del usuario
  const [showForm, setShowForm] = useState(false); // ⬅️ Estado para mostrar/ocultar formulario de creación de vuelo

  // 🔥 Obtener el rol del usuario desde el token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodificar el token JWT
      setUserRole(decodedToken.role); // ⬅️ Guardar el rol del usuario
    }
  }, []);

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
      setTimeout(() => (window.location.href = `/pago/${res.data.booking.id}`), 2000);
    } catch (error) {
      toast.error("Error al reservar el vuelo");
    }
  };

  // ✈️ Crear un nuevo vuelo (solo admins)
  const handleCreateFlight = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    const flightData = {
      airline: event.target.airline.value,
      origin: event.target.origin.value,
      destination: event.target.destination.value,
      departure_time: event.target.departure_time.value,
      arrival_time: event.target.arrival_time.value,
      price: parseFloat(event.target.price.value),
    };

    try {
      await axios.post("https://sistema-reservas-final.onrender.com/api/flights", flightData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Vuelo creado con éxito");
      setShowForm(false);
    } catch (error) {
      toast.error("Error al crear el vuelo");
    }
  };

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

      {/* 🔥 Botón de crear vuelo (solo si el usuario es admin) */}
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

              <label>Precio:</label>
              <input type="number" name="price" step="0.01" required />

              <button type="submit">✈️ Crear Vuelo</button>
            </form>
          )}
        </>
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