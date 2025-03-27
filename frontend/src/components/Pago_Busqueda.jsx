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

  // 🔹 Simula el pago
  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const res = await axios.post(
        "https://sistema-reservas-final.onrender.com/api/bookings/pay-multiple",
        { selectedFlights, category, totalPrice },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        toast.success("✅ Pago exitoso. Generando ticket...");
        setPaymentSuccess(true); // ✅ Habilitar la descarga
      }
    } catch (error) {
      toast.error("❌ Error al procesar el pago.");
    } finally {
      setIsPaying(false);
    }
  };

  // 📥 Descargar PDF después del pago
  const handleDownloadPDF = async () => {
    if (!paymentSuccess) {
      toast.error("⚠️ Primero debes pagar la reserva.");
      return;
    }

    try {
      const res = await axios.post(
        "https://sistema-reservas-final.onrender.com/api/bookings/pdf-multiple",
        { flightIds: selectedFlights.map(flight => flight.id) }, // ✅ Enviar IDs en el body
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // 📂 Indicar que es un archivo PDF
        }
      );

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ticket_vuelos.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("❌ Error al descargar el ticket.");
    }
  };

  return (
    <div className="payment-container">
      <h2>💳 Pago de Tramos Seleccionados</h2>

      {selectedFlights.map((flight, index) => (
        <div key={index}>
          <p>Vuelo {index + 1}: {flight.origin} → {flight.destination}</p>
          <p>Fecha: {flight.departure_time}</p>
        </div>
      ))}

      <h3>Total a pagar: ${totalPrice}</h3>

      {!paymentSuccess ? (
        <button onClick={handlePayment} disabled={isPaying}>
          {isPaying ? "Procesando pago..." : `Pagar $${totalPrice}`}
        </button>
      ) : (
        <button onClick={handleDownloadPDF}>
          📥 Descargar Ticket PDF
        </button>
      )}

      <button onClick={() => navigate("/buscar")}>🔙 Volver</button>
    </div>
  );
};

export default PagoBusqueda;
