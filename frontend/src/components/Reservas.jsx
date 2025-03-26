import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Reservas = () => {
  const [flights, setFlights] = useState([]);
  const [availableCities, setAvailableCities] = useState([]); 
  const [origin, setOrigin] = useState(""); 
  const [destination, setDestination] = useState("");
  const [searchMode, setSearchMode] = useState(false); // 🔄 Alternar entre lista y búsqueda por ciudades
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
    const fetchCities = async () => {
      try {
        const res = await axios.get("https://sistema-reservas-final.onrender.com/api/flights/cities");
        setAvailableCities(res.data);
      } catch (error) {
        toast.error("❌ Error al obtener ciudades");
      }
    };
    fetchFlights();
    fetchCities();
  }, []);

  // Cargar los vuelos desde el backend
  const fetchFlights = async () => {
    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/flights/search?origin=${selectedOrigin}&destination=${selectedDestination}`
      );
  
      if (res.data.flights.length === 0 && res.data.segments.length === 0) {
        toast.warning("⚠️ No hay vuelos disponibles para esta ruta.");
      } else {
        toast.success("✅ Vuelos encontrados.");
      }
  
      setFlights(res.data.flights);
      setSegments(res.data.segments);
    } catch (error) {
      toast.error("❌ Error al obtener vuelos.");
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  // Manejar la reserva (sin segmentos)
  const handleBooking = async () => {
    if (!selectedFlight) {
      toast.warning("⚠️ Selecciona un vuelo primero");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      // 🔹 Verificar si el vuelo tiene tramos o es directo
      const flightData = {
        flightId: selectedFlight.tramos ? selectedFlight.tramos[0].id : selectedFlight.id, // Si hay tramos, usar el primer vuelo
        category,
        segments: selectedFlight.tramos ? selectedFlight.tramos.map(tramo => ({
          flight_id: tramo.id,
          origin: tramo.origin,
          destination: tramo.destination,
          departure_time: tramo.departure_time,
          arrival_time: tramo.arrival_time,
        })) : []
      };
  
      // 🔥 Enviar la reserva al backend
      const res = await axios.post(
        "https://sistema-reservas-final.onrender.com/api/bookings",
        flightData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      toast.success("✅ Reserva exitosa. ¡Vamos a pagar!");
      setTimeout(() => (window.location.href = `/pago/${res.data.booking.id}`), 2000);
    } catch (error) {
      toast.error("❌ Error al reservar el vuelo");
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

  const buscarVuelos = async () => {
    if (!origin || !destination) {
      toast.warning("⚠️ Selecciona una ciudad de origen y destino.");
      return;
    }
  
    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/flights/search?origin=${origin}&destination=${destination}`
      );
  
      if (res.data.length > 0) {
        setFilteredFlights(res.data); // Guardar los vuelos encontrados
      } else {
        toast.info("🔍 No hay vuelos directos, buscando tramos intermedios...");
        generarVuelosPorTramos();
      }
    } catch (error) {
      toast.error("❌ Error al buscar vuelos.");
    }
  };

  const buscarVuelosPorTramos = async () => {
    if (!origin || !destination) {
      toast.warning("⚠️ Selecciona una ciudad de origen y destino");
      return;
    }
  
    try {
      // 🔹 1. Obtener todos los vuelos disponibles
      const res = await axios.get("https://sistema-reservas-final.onrender.com/api/flights");
      const allFlights = res.data;
  
      // 🔹 2. Verificar si hay un vuelo directo
      const vueloDirecto = allFlights.find(
        (flight) => flight.origin === origin && flight.destination === destination
      );
  
      if (vueloDirecto) {
        setFilteredFlights([vueloDirecto]); // ✅ Mostrar vuelo directo
        return;
      }
  
      // 🔹 3. Buscar vuelos con escalas (1 o más tramos)
      const posiblesRutas = [];
      
      allFlights.forEach((vuelo1) => {
        if (vuelo1.origin === origin) {
          allFlights.forEach((vuelo2) => {
            if (vuelo1.destination === vuelo2.origin && vuelo2.destination === destination) {
              posiblesRutas.push([vuelo1, vuelo2]); // Guardar vuelos con 1 escala
            }
          });
        }
      });
  
      // 🔹 4. Si hay rutas con escalas, calcular precios y mostrar
      if (posiblesRutas.length > 0) {
        const rutasConPrecio = posiblesRutas.map((ruta) => {
          const precioTotal = ruta.reduce((acc, vuelo) => acc + parseFloat(vuelo.price_turista), 0);
          return { tramos: ruta, precioTotal };
        });
  
        setFilteredFlights(rutasConPrecio);
        return;
      }
  
      // 🔹 5. Si no se encuentra ruta posible, mostrar mensaje
      toast.error("❌ No se encontraron vuelos disponibles para esta ruta");
  
    } catch (error) {
      toast.error("❌ Error al buscar vuelos");
    }
  };

  const generarVuelosPorTramos = async () => {
    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/flights/generate-tramos?origin=${origin}&destination=${destination}`
      );
  
      if (res.data.length > 0) {
        setFilteredFlights(res.data); // Mostrar los vuelos generados
        toast.success("✅ Tramos generados automáticamente.");
      } else {
        toast.warning("⚠️ No se pudieron generar vuelos para este destino.");
      }
    } catch (error) {
      toast.error("❌ Error al generar vuelos por tramos.");
    }
  };

  return (
    <div>
      <h2>✈️ Vuelos disponibles</h2>
  
      {/* ✅ Botón para alternar entre lista de vuelos y búsqueda */}
      <button onClick={() => setSearchMode(!searchMode)}>
        {searchMode ? "🔙 Volver a Lista de Vuelos" : "🔍 Buscar Vuelo por Ciudad"}
      </button>
  
      {/* 🔍 Modo búsqueda por ciudad */}
      {searchMode ? (
        <div>
          <h3>Buscar Vuelo por Ciudad</h3>
  
          <label>Ciudad de Origen:</label>
          <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
            <option value="">Seleccione una ciudad</option>
            {availableCities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
  
          <label>Ciudad de Destino:</label>
          <select value={destination} onChange={(e) => setDestination(e.target.value)}>
            <option value="">Seleccione una ciudad</option>
            {availableCities
              .filter(city => city !== origin)
              .map((city, index) => (
                <option key={index} value={city}>{city}</option>
            ))}
          </select>
  
          <button onClick={buscarVuelosPorTramos}>✈️ Buscar Vuelos</button>
  
          {/* 📌 Resultados de búsqueda */}
          {filteredFlights.length > 0 ? (
          <div>
            <h3>Vuelos Encontrados</h3>
            {filteredFlights.map((flight, index) => (
              <div key={index} className="flight-card">
                {flight.tramos ? (
                  <>
                    <h3>🛫 Vuelo con Escalas</h3>
                    {flight.tramos.map((tramo, i) => (
                      <p key={i}>{`${tramo.airline} - ${tramo.origin} → ${tramo.destination}`}</p>
                    ))}
                    <p>💰 Precio Total: ${flight.precioTotal.toFixed(2)}</p>
                  </>
                ) : (
                  <>
                    <h3>{`${flight.airline} - ${flight.origin} → ${flight.destination}`}</h3>
                    <p>Salida: {new Date(flight.departure_time).toLocaleString()}</p>
                    <p>💰 Precio: ${flight.price_turista}</p>
                  </>
                )}
                <button onClick={() => setSelectedFlight(flight)}>Seleccionar</button>
              </div>
            ))}
          </div>
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

                {/* Mostrar tramos si hay conexiones */}
                {segments.length > 0 && (
                  <div className="segments-container">
                    <h4>🛫 Escalas:</h4>
                    {segments.map((segment, segIndex) => (
                      <div key={segIndex} className="segment-card">
                        <p>{`${segment.airline} - ${segment.origin} → ${segment.destination}`}</p>
                        <p>Salida: {new Date(segment.departure_time).toLocaleString()}</p>
                        <p>Precio Turista: ${segment.price_turista}</p>
                        <p>Precio Business: ${segment.price_business}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={() => setSelectedFlight(flight)}>Seleccionar</button>
              </div>
            ))
          ) : (
            <p>No hay vuelos disponibles en este momento</p>
          )}
        </div>
      )}
  
      {/* 📌 Opciones de reserva una vez seleccionado un vuelo */}
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
  
      {/* 🔒 Funcionalidad solo para administradores */}
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
  
      {/* 🚪 Botón de cerrar sesión */}
      <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Reservas;