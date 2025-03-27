import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const Pago = () => {
  const { id } = useParams(); // 📌 Capturamos el ID de la reserva desde la URL
  const [booking, setBooking] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // ✅ Estado para pago exitoso
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // ✅ Obtener token

  // 🔥 Función para cargar la reserva
  const fetchBooking = async () => {
    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/bookings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Enviar token
        }
      );

      // Verificamos si la reserva tiene tramos o es un vuelo directo
      const { segments, flight, status } = res.data;
      setBooking({
        ...res.data,
        isMultiSegment: segments && segments.length > 0, // Si tiene segmentos, es vuelo con tramos
        totalPrice: calculateTotalPrice(res.data),
      });

      // ✅ Si la reserva ya está pagada, activar `paymentSuccess`
      if (status === "pagado") {
        setPaymentSuccess(true);
      }
    } catch (error) {
      toast.error("❌ Error al cargar la reserva");
    }
  };

  // Función para calcular el precio total correctamente
  const calculateTotalPrice = (bookingData) => {
    if (bookingData.segments && bookingData.segments.length > 0) {
      return bookingData.segments.reduce((sum, segment) => sum + segment.price, 0);
    }
    return bookingData.flight ? bookingData.flight.price : 0;
  };

  // 🟢 Cargar la reserva al montar el componente
  useEffect(() => {
    if (token) {
      fetchBooking();
    } else {
      toast.error("⚠️ No estás autenticado.");
      navigate("/login");
    }
  }, [id, token, navigate]);

  // 🎯 Simular pago
  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const res = await axios.post(
        `https://sistema-reservas-final.onrender.com/api/bookings/${id}/pay`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Enviar token
        }
      );

      if (res.status === 200) {
        toast.success("✅ Pago realizado con éxito. Tu ticket está listo.");
        setPaymentSuccess(true); // ✅ Habilitar botón de descarga
        fetchBooking(); // Recargar datos de la reserva
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
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/bookings/${id}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Enviar token
          responseType: "blob", // 📂 Indicar que es un archivo PDF
        }
      );

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ticket_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("❌ Error al descargar el ticket.");
    }
  };

  // 🔥 Renderizar la página de pago
  return (
    <div className="payment-container">
      <h2>💳 Pago de tu Reserva</h2>

      {booking ? (
        <>
          <h3>Detalles del Vuelo:</h3>
          {booking.isMultiSegment ? (
            <>
              <p><strong>Tipo:</strong> Vuelo con tramos</p>
              {booking.segments.map((segment, index) => (
                <div key={index} className="segment">
                  <p>✈️ Tramo {index + 1}: {segment.origin} → {segment.destination}</p>
                  <p>🕐 Salida: {segment.departure_time ? new Date(segment.departure_time).toLocaleString() : "Hora no disponible"}</p>
                  <p>🛬 Llegada: {segment.arrival_time ? new Date(segment.arrival_time).toLocaleString() : "Hora no disponible"}</p>
                  <p>💰 Precio: ${segment.price.toFixed(2)}</p>
                </div>
              ))}
            </>
          ) : (
            <>
              <p><strong>Tipo:</strong> Vuelo directo</p>
              <p>✈️ {booking.flight?.origin} → {booking.flight?.destination}</p>
              <p>🕐 Salida: {booking.flight?.departure_time ? new Date(booking.flight.departure_time).toLocaleString() : "Hora no disponible"}</p>
              <p>🛬 Llegada: {booking.flight?.arrival_time ? new Date(booking.flight.arrival_time).toLocaleString() : "Hora no disponible"}</p>
              <p>💰 Precio: ${booking.flight?.price ? booking.flight.price.toFixed(2) : "N/A"}</p>
            </>
          )}

          <p>🎟️ Categoría: {booking.category}</p>
          <p>💰 Precio total: ${booking.totalPrice.toFixed(2)}</p>

          {!paymentSuccess ? (
            <button onClick={handlePayment} disabled={isPaying}>
              {isPaying ? "Procesando pago..." : `Pagar $${booking.totalPrice.toFixed(2)}`}
            </button>
          ) : (
            <button onClick={handleDownloadPDF}>
              📥 Descargar Ticket PDF
            </button>
          )}
        </>
      ) : (
        <p>Cargando reserva...</p>
      )}

      <button onClick={() => navigate("/reservas")}>🔙 Volver</button>
    </div>
  );
};

export default Pago;