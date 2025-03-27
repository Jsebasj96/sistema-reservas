import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BusquedaVuelos = ({ setSelectedFlight, setSegments = () => {} }) => {
  const [availableCities, setAvailableCities] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [selectedFlights, setSelectedFlights] = useState([]); // 🛫 Tramos seleccionados
  const [category, setCategory] = useState("turista"); // ✅ Estado para categoría de boleto

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

  const fetchFlights = async () => {
    if (!selectedOrigin || !selectedDestination) {
      toast.warning("⚠️ Selecciona una ciudad de origen y destino.");
      return;
    }

    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/flights/search?origin=${selectedOrigin}&destination=${selectedDestination}`
      );

      if (!res.data || !Array.isArray(res.data.flights)) {
        toast.error("❌ No se encontraron vuelos.");
        return;
      }

      const flights = res.data.flights;
      const segments = res.data.segments || [];

      if (flights.length > 0 || segments.length > 0) {
        setFilteredFlights([...flights, ...segments]);
        setSegments(segments);
        toast.success(`✅ Se encontraron ${flights.length + segments.length} vuelos.`);
      } else {
        toast.error("❌ No se encontraron vuelos.");
      }
    } catch (error) {
      toast.error("❌ No se pudieron buscar vuelos.");
    }
  };

  const handleSelectFlight = (flight) => {
    // Si ya está en la lista, lo eliminamos; si no, lo agregamos
    setSelectedFlights((prev) =>
      prev.some((f) => f.id === flight.id)
        ? prev.filter((f) => f.id !== flight.id)
        : [...prev, flight]
    );
  };

  const handleBooking = async () => {
    if (selectedFlights.length === 0) {
      toast.warning("⚠️ Debes seleccionar al menos un tramo.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const flightData = {
        category,
        segments: selectedFlights.map((segment) => ({
          flight_id: segment.id,
          origin: segment.origin,
          destination: segment.destination,
          departure_time: segment.departure_time,
          arrival_time: segment.arrival_time,
        })),
        price: selectedFlights.reduce(
          (total, flight) => total + (category === "business" ? flight.price_business : flight.price_turista),
          0
        ), // ✅ Sumar precios según categoría
      };

      const res = await axios.post(
        "https://sistema-reservas-final.onrender.com/api/bookings",
        flightData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Reserva exitosa. ¡Vamos a pagar!");
      setTimeout(() => (window.location.href = `/pago/${res.data.booking.id}`), 2000);
    } catch (error) {
      toast.error("❌ No se pudo realizar la reserva.");
    }
  };

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

      <button onClick={fetchFlights}> Buscar Vuelos </button>

      {filteredFlights.length > 0 && (
        <div>
          {filteredFlights.map((flight, index) => (
            <div key={index} className="flight-card" style={{ border: selectedFlights.some((f) => f.id === flight.id) ? "2px solid green" : "none" }}>
              <h3>{`${flight.airline} - ${flight.origin} → ${flight.destination}`}</h3>
              <p>Salida: {new Date(flight.departure_time).toLocaleString()}</p>
              <p>💰 Precio Turista: ${flight.price_turista}</p>
              <p>💎 Precio Business: ${flight.price_business}</p>
              <button onClick={() => handleSelectFlight(flight)}>
                {selectedFlights.some((f) => f.id === flight.id) ? "✅ Seleccionado" : "Seleccionar"}
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedFlights.length > 0 && (
        <div>
          <h3>🎫 Selección de Categoría</h3>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="turista">
              Turista - ${selectedFlights.reduce((total, flight) => total + flight.price_turista, 0)}
            </option>
            <option value="business">
              Business - ${selectedFlights.reduce((total, flight) => total + flight.price_business, 0)}
            </option>
          </select>
          <button onClick={handleBooking}>Reservar ahora</button>
        </div>
      )}

      <p>{filteredFlights.length === 0 && "🔎 No se encontraron vuelos directos ni rutas con escalas."}</p>

      <button onClick={volverAReservas} style={{ marginTop: "20px", backgroundColor: "#f44336", color: "white" }}>
        ⬅️ Volver a Reservas
      </button>

      {/* 🚪 Botón de cerrar sesión */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        style={{ marginTop: "20px", backgroundColor: "#d32f2f", color: "white" }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default BusquedaVuelos;