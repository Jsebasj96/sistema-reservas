import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const Pago = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchBooking = async () => {
    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/bookings/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooking(res.data);
      if (res.data.status === "PAID") {
        setPaymentSuccess(true);
        fetchHotels(res.data.destination);
      }
    } catch (error) {
      toast.error("❌ Error al cargar la reserva");
    }
  };

  const fetchHotels = async (city) => {
    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/hotels?city=${city}`
      );
      setHotels(res.data);
    } catch (error) {
      toast.error("❌ Error al cargar hoteles");
    }
  };

  useEffect(() => {
    if (token) {
      fetchBooking();
    } else {
      toast.error("⚠️ No estás autenticado.");
      navigate("/login");
    }
  }, [id, token, navigate]);

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const res = await axios.post(
        `https://sistema-reservas-final.onrender.com/api/bookings/${id}/pay`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        toast.success("✅ Pago realizado con éxito");
        setPaymentSuccess(true);
        fetchBooking(); 
      }
    } catch (error) {
      toast.error("❌ Error al procesar el pago");
    } finally {
      setIsPaying(false);
    }
  };

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

  const handleHotelBooking = async () => {
    if (!selectedHotel || !checkIn || !checkOut) {
      toast.warning("Completa todos los campos para reservar el hotel.");
      return;
    }

    try {
      const res = await axios.post(
        "https://sistema-reservas-final.onrender.com/api/hotel-bookings",
        {
          hotelId: selectedHotel,
          checkIn,
          checkOut,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("🏨 Hotel reservado con éxito");
    } catch (error) {
      toast.error("❌ Error al reservar hotel");
    }
  };

  return (
    <div className="payment-container">
      <h2>💳 Pago de tu Reserva</h2>

      {booking ? (
        <>
          <p>Vuelo: {booking.origin} → {booking.destination}</p>
          <p>Categoría: {booking.category}</p>
          <p>Precio total: ${Number(booking.price).toFixed(2)}</p>

          {!paymentSuccess ? (
            <button onClick={handlePayment} disabled={isPaying}>
              {isPaying ? "Procesando pago..." : `Pagar $${booking.price}`}
            </button>
          ) : (
            <>
              <button onClick={handleDownloadPDF}>
                📥 Descargar Ticket PDF
              </button>

              {/* 🔥 Sección de hoteles */}
              <h3>🏨 Reserva un hotel en {booking.destination}</h3>
              <label>Hotel:</label>
              <select
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
              >
                <option value="">Selecciona un hotel</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} - {hotel.city}
                  </option>
                ))}
              </select>

              <label>Check-in:</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
              <label>Check-out:</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />

              <button onClick={handleHotelBooking}>🛏️ Reservar Hotel</button>
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
