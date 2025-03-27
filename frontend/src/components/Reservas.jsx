import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Reservas = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [category, setCategory] = useState("turista");
  const [userRole, setUserRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [price, setPrice] = useState("");
  const [priceTurista, setPriceTurista] = useState("");
  const [priceBusiness, setPriceBusiness] = useState("");

  // Obtener el rol del usuario desde el token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodificar JWT
      setUserRole(decodedToken.role);
    }
  }, []);

  // Cargar los vuelos desde el backend
  const fetchFlights = async () => {
    try {
      const res = await axios.get("https://sistema-reservas-final.onrender.com/api/flights");
      setFlights(res.data);
    } catch (error) {
      toast.error("Error cargando vuelos");
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  // Manejar la reserva (sin segmentos)
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
          segments: []  // Se envía un array vacío de segmentos
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

  // Crear un nuevo vuelo (solo admins)
  const handleCreateFlight = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    const flightData = {
      airline: event.target.airline.value,
      origin: event.target.origin.value,
      destination: event.target.destination.value,
      departure_time: event.target.departure_time.value,
      arrival_time: event.target.arrival_time.value,
      price: price,
    };

    try {
      await axios.post("https://sistema-reservas-final.onrender.com/api/flights", flightData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Vuelo creado con éxito");
      setShowForm(false);
      fetchFlights(); // Actualizar la lista de vuelos automáticamente
    } catch (error) {
      toast.error("Error al crear el vuelo");
    }
  };

  // Calcular precios automáticamente al ingresar el precio base
  const handlePriceChange = (e) => {
    const basePrice = parseFloat(e.target.value);
    setPrice(basePrice);

    if (!isNaN(basePrice) && basePrice > 0) {
      setPriceTurista(basePrice.toFixed(2)); // Turista = Precio base
      setPriceBusiness((basePrice * 1.12).toFixed(2)); // Business = Precio base + 12%
    } else {
      setPriceTurista("");
      setPriceBusiness("");
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
            <p>Precio Turista: ${flight.price_turista}</p>
            <p>Precio Business: ${flight.price_business}</p>
            <button onClick={() => setSelectedFlight(flight)}>Seleccionar</button>
          </div>
        ))
      ) : (
        <p>No hay vuelos disponibles en este momento</p>
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
              <label>Precio Base:</label>
              <input type="number" name="price" step="0.01" value={price} onChange={handlePriceChange} required />
              <button type="submit">✈️ Crear Vuelo</button>
            </form>
          )}
        </>
      )}

      <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Reservas;