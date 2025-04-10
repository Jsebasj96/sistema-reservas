import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const Pago = () => {
  const { id } = useParams(); // Capturamos el ID de la reserva desde la URL
  const [booking, setBooking] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [showHotels, setShowHotels] = useState(false);
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
      setBooking(res.data);
      if (res.data.status === "PAID") {
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
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

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

  // 🔄 Cargar hoteles después del pago exitoso
  useEffect(() => {
    const fetchHotels = async () => {
      if (paymentSuccess && booking?.destination) {
        try {
          const res = await axios.get(
            `https://sistema-reservas-final.onrender.com/api/hotels?city=${booking.destination}`
          );
          setHotels(res.data);
          setShowHotels(true);
        } catch (error) {
          toast.error("❌ No se pudieron cargar los hoteles.");
        }
      }
    };

    fetchHotels();
  }, [paymentSuccess, booking]);


  const handleHotelBooking = async (hotelId) => {
    try {
      await axios.post(
        "https://sistema-reservas-final.onrender.com/api/hotel-bookings",
        {
          hotel_id: hotelId,
          booking_id: booking.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("✅ Hotel reservado con éxito");
    } catch (error) {
      toast.error("❌ Error al reservar el hotel");
    }
  };

  return (
    <div className="payment-container">
      <h2>💳 Pago de tu Reserva</h2>

      {booking ? (
        <>
          <p>Vuelo: {booking.flight?.origin} → {booking.flight?.destination}</p>
          <p>Categoría: {booking.category}</p>
          <p>Precio total: ${booking.price ? Number(booking.price).toFixed(2) : "N/A"}</p>

          {!paymentSuccess ? (
            <button onClick={handlePayment} disabled={isPaying}>
              {isPaying ? "Procesando pago..." : `Pagar $${booking.price}`}
            </button>
          ) : (
            <>
              <button onClick={handleDownloadPDF}>
                📥 Descargar Ticket PDF
              </button>

              {/* 🔥 Mostrar hoteles después del pago */}
              {showHotels && hotels.length > 0 && (
                <div className="hotels-section">
                  <h3>🏨 Hoteles disponibles en {booking.destination}</h3>
                  {hotels.map((hotel) => (
                    <div key={hotel.id} className="hotel-card">
                      <h4>{hotel.name}</h4>
                      <p>🌟 Categoría: {hotel.category}</p>
                      <p>📍 Ciudad: {hotel.city}, {hotel.country}</p>
                      <a href={hotel.website} target="_blank" rel="noopener noreferrer">
                        🌐 Ver sitio web
                      </a>
                      <button onClick={() => handleHotelBooking(hotel.id)}>
                        Reservar Hotel
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
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
