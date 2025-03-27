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
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("❌ No hay sesión activa. Inicia sesión.");
        return;
      }
  
      // Aquí suponemos que solo hay una reserva activa y tomamos el primer vuelo
      if (selectedFlights.length === 0) {
        toast.error("⚠️ No hay vuelos seleccionados.");
        return;
      }
  
      const bookingId = selectedFlights[0].bookingId; // Suponiendo que cada vuelo tiene un ID de reserva asociado
  
      console.log("Solicitando PDF para bookingId:", bookingId);
  
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/bookings/${bookingId}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
  
      // Verificar que el PDF no esté vacío
      if (!res.data || res.data.size === 0) {
        throw new Error("El PDF recibido está vacío.");
      }
  
      console.log("PDF recibido correctamente:", res);
  
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ticket_${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("📥 Ticket descargado con éxito.");
    } catch (error) {
      console.error("❌ Error al descargar el ticket:", error);
      toast.error("❌ No se pudo descargar el ticket.");
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
