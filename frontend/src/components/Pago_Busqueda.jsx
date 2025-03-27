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
  const [bookingId, setBookingId] = useState(null); // ✅ Guardar ID de reserva
  const token = localStorage.getItem("token"); 

  if (!selectedFlights || selectedFlights.length === 0) {
    return <h2>No hay tramos seleccionados.</h2>;
  }

  // 🔹 Simula el pago
  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const res = await axios.post(
        "https://sistema-reservas-final.onrender.com/api/bookings/pay-multiple",
        { selectedFlights, category, totalPrice }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        toast.success("✅ Pago exitoso. Generando ticket...");
        setBookingId(res.data.bookingId); // ✅ Guardar ID de reserva para el PDF
        setPaymentSuccess(true); 
      }
    } catch (error) {
      toast.error("❌ Error al procesar el pago.");
    } finally {
      setIsPaying(false);
    }
  };

  // 📥 Descargar PDF usando pdfkit
  const handleDownloadPDF = async () => {
    if (!paymentSuccess || !bookingId) {
      toast.error("⚠️ Primero debes pagar la reserva.");
      return;
    }

    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/bookings/pdf-multiple?bookingId=${bookingId}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

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
