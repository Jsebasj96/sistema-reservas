import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PagoBusqueda = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedFlights, category, totalPrice } = location.state || {};
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false); 
  const token = localStorage.getItem("token"); 

  if (!selectedFlights || selectedFlights.length === 0) {
    return <h2>No hay tramos seleccionados.</h2>;
  }

  // 🔹 Simula el pago (sin depender de `bookingId`)
  const handlePayment = async () => {
    setIsPaying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulación de espera de pago
      toast.success("✅ Pago exitoso. Generando ticket...");
      setPaymentSuccess(true); // ✅ Habilita la descarga
    } catch (error) {
      toast.error("❌ Error al procesar el pago.");
    } finally {
      setIsPaying(false);
    }
  };

  // 📥 Descargar PDF
  const handleDownloadPDF = async () => {
    if (!paymentSuccess) {
      toast.error("⚠️ Primero debes pagar la reserva.");
      return;
    }

    try {
      const flightIds = selectedFlights.map(flight => flight.id).join(",");
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/bookings/pdf-multiple?flightIds=${flightIds}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      // ✅ Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ticket_vuelos.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("❌ Error al descargar el ticket.");
    }
  };

  return (
    <div>
      <h2>🛫 Pago de Reservas</h2>
      <h3>Resumen de Tramos Seleccionados</h3>

      <ul>
        {selectedFlights.map((flight, index) => (
          <li key={index}>
            <strong>{flight.origin} → {flight.destination}</strong><br />
            🕐 Salida: {new Date(flight.departure_time).toLocaleString()}<br />
            🕐 Llegada: {new Date(flight.arrival_time).toLocaleString()}<br />
            💰 Precio: ${category === "turista" ? flight.price_turista : flight.price_business}
          </li>
        ))}
      </ul>

      <h3>Total a Pagar: <span style={{ color: "green" }}>${totalPrice}</span></h3>

      {!paymentSuccess ? (
        <button onClick={handlePayment} disabled={isPaying} style={{ backgroundColor: "green", color: "white", padding: "10px", marginTop: "10px" }}>
          {isPaying ? "Procesando pago..." : "💳 Pagar Ahora"}
        </button>
      ) : (
        <button onClick={handleDownloadPDF} style={{ backgroundColor: "blue", color: "white", padding: "10px", marginTop: "10px" }}>
          📥 Descargar Ticket PDF
        </button>
      )}

      <button onClick={() => navigate("/")} style={{ marginLeft: "10px", padding: "10px" }}>
        🔙 Volver al Inicio
      </button>
    </div>
  );
};

export default PagoBusqueda;
