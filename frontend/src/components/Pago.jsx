import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const Pago = () => {
  const { id } = useParams(); // 📌 Capturamos el ID de la reserva desde la URL
  const [booking, setBooking] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔥 Función para cargar la reserva
  const fetchBooking = async () => {
    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/bookings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { segments, flight, status } = res.data;

      // 📌 Verificar si es un vuelo directo o con tramos
      const isMultiSegment = segments && segments.length > 0;

      // 📌 Calcular el precio total sumando todos los tramos
      const totalPrice = isMultiSegment
        ? segments.reduce((sum, segment) => sum + segment.price, 0)
        : flight?.price || 0;

      setBooking({
        ...res.data,
        isMultiSegment,
        totalPrice,
      });

      // ✅ Si la reserva ya está pagada, marcarla como pagada
      if (status === "pagado") {
        setPaymentSuccess(true);
      }
    } catch (error) {
      toast.error("❌ Error al cargar la reserva");
    }
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        toast.success("✅ Pago realizado con éxito. Tu ticket está listo.");
        setPaymentSuccess(true);
        fetchBooking();
      }
    } catch (error) {
      toast.error("❌ Error al procesar el pago.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>💳 Pago de tu Reserva</h2>

      {booking ? (
        <>
          <h3>Detalles del Vuelo:</h3>

          {/* 🔥 Si es un vuelo con tramos, mostrar todos los segmentos */}
          {booking.isMultiSegment ? (
            <>
              <p><strong>Tipo:</strong> Vuelo con tramos</p>
              {booking.segments.map((segment, index) => (
                <div key={index} className="segment">
                  <h4>✈️ Tramo {index + 1}: {segment.origin} → {segment.destination}</h4>
                  <p>🕐 Salida: {segment.departure_time ? new Date(segment.departure_time).toLocaleString() : "Hora no disponible"}</p>
                  <p>🛬 Llegada: {segment.arrival_time ? new Date(segment.arrival_time).toLocaleString() : "Hora no disponible"}</p>
                  <p>💰 Precio: ${segment.price.toFixed(2)}</p>
                </div>
              ))}
            </>
          ) : (
            <>
              {/* 🔥 Si es un vuelo directo, mostrar como en el código original */}
              <p><strong>Tipo:</strong> Vuelo directo</p>
              <p>✈️ {booking.flight?.origin} → {booking.flight?.destination}</p>
              <p>🕐 Salida: {booking.flight?.departure_time ? new Date(booking.flight.departure_time).toLocaleString() : "Hora no disponible"}</p>
              <p>🛬 Llegada: {booking.flight?.arrival_time ? new Date(booking.flight.arrival_time).toLocaleString() : "Hora no disponible"}</p>
              <p>💰 Precio: ${booking.flight?.price ? booking.flight.price.toFixed(2) : "N/A"}</p>
            </>
          )}

          {/* 🔥 Datos generales de la reserva */}
          <p>🎟️ Categoría: {booking.category}</p>
          <p><strong>💰 Precio total:</strong> ${booking.totalPrice.toFixed(2)}</p>

          {/* 🔥 Botón de pago */}
          {!paymentSuccess ? (
            <button onClick={handlePayment} disabled={isPaying}>
              {isPaying ? "Procesando pago..." : `Pagar $${booking.totalPrice.toFixed(2)}`}
            </button>
          ) : (
            <button>
              ✅ Pago realizado
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