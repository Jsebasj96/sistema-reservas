import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BusquedaVuelos = ({ setSelectedFlight, setSegments = () => {} }) => {
  const [availableCities, setAvailableCities] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [selectedFlights, setSelectedFlights] = useState([]); 
  const [category, setCategory] = useState("turista");

  const navigate = useNavigate();

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
    setSelectedFlights((prev) =>
      prev.some((f) => f.id === flight.id)
        ? prev.filter((f) => f.id !== flight.id)
        : [...prev, flight]
    );
  };

  // Nueva función para redirigir a la página de pago de búsqueda
  const handleRedirectToPayment = () => {
    if (!selectedFlights.length) {
      toast.warning("⚠️ Selecciona al menos un tramo para reservar.");
      return;
    }

    const priceField = category === "turista" ? "price_turista" : "price_business";
    const totalPrice = selectedFlights.reduce((total, flight) => total + Number(flight[priceField]), 0);

    navigate("/pago-busqueda", {
      state: {
        selectedFlights,
        category,
        totalPrice,
      },
    });
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
              Turista - ${selectedFlights.reduce((total, flight) => total + Number(flight.price_turista), 0).toLocaleString()}
            </option>
            <option value="business">
              Business - ${selectedFlights.reduce((total, flight) => total + Number(flight.price_business), 0).toLocaleString()}
            </option>
          </select>

          {/* Botón modificado para redirigir a la sección de pago sin afectar reservas */}
          <button onClick={handleRedirectToPayment} style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px", marginTop: "10px" }}>
            💳 Proceder al Pago
          </button>
        </div>
      )}

      <button onClick={volverAReservas} style={{ marginTop: "20px", backgroundColor: "#f44336", color: "white" }}>
        ⬅️ Volver a Reservas
      </button>

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