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
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelBooked, setHotelBooked] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchBooking = async () => {
    try {
      const res = await axios.get(`https://sistema-reservas-final.onrender.com/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooking(res.data);
      if (res.data.status === "PAID") {
        setPaymentSuccess(true);
        fetchHotels(res.data.destination); // 🔥 Cargar hoteles si el vuelo ya está pagado
      }
    } catch (error) {
      toast.error("❌ Error al cargar la reserva");
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
        toast.success("✅ Pago realizado con éxito. Tu ticket está listo.");
        setPaymentSuccess(true);
        fetchBooking();
        fetchHotels(booking.destination);
      }
    } catch {
      toast.error("❌ Error al procesar el pago.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!paymentSuccess) return toast.error("⚠️ Primero debes pagar la reserva.");
    try {
      const res = await axios.get(`https://sistema-reservas-final.onrender.com/api/bookings/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ticket_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error("❌ Error al descargar el ticket.");
    }
  };

  const fetchHotels = async (city) => {
    try {
      const res = await axios.get(`https://sistema-reservas-final.onrender.com/api/hotels?city=${city}`);
      setHotels(res.data);
    } catch {
      toast.error("❌ Error al cargar hoteles");
    }
  };

  const handleHotelBooking = async () => {
    if (!selectedHotel || !checkIn || !checkOut) {
      toast.error("⚠️ Completa todos los campos para reservar el hotel");
      return;
    }

    try {
      const res = await axios.post(
        "https://sistema-reservas-final.onrender.com/api/hotel-bookings",
        { hotelId: selectedHotel.id, checkIn, checkOut },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Hotel reservado con éxito");
      setHotelBooked(res.data.booking);
    } catch (error) {
      toast.error("❌ Error al reservar hotel: " + error.response?.data?.error || "Error desconocido");
    }
  };

  const handleDownloadHotelPDF = async () => {
    if (!hotelBooked) return toast.error("⚠️ Primero debes reservar un hotel");
    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/hotel-bookings/${hotelBooked.id}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reserva_hotel_${hotelBooked.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error("❌ Error al descargar PDF del hotel");
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
            <button onClick={handleDownloadPDF}>📥 Descargar Ticket PDF</button>
          )}

          {/* 🔥 Mostrar hoteles solo si ya se pagó */}
          {paymentSuccess && (
            <div className="hotel-reservation">
              <h3>🏨 Hoteles disponibles en {booking.destination}</h3>
              {hotels.length > 0 ? (
                <>
                  <select onChange={(e) => {
                    const hotel = hotels.find(h => h.id === parseInt(e.target.value));
                    setSelectedHotel(hotel);
                  }}>
                    <option value="">Selecciona un hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name} - ${hotel.price_per_night} por noche
                      </option>
                    ))}
                  </select>
                  <label>Check-in:</label>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                  <label>Check-out:</label>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                  <button onClick={handleHotelBooking}>Reservar Hotel</button>
                </>
              ) : (
                <p>No hay hoteles disponibles.</p>
              )}

              {/* ✅ Mostrar opción de descarga de PDF del hotel */}
              {hotelBooked && (
                <button onClick={handleDownloadHotelPDF}>
                  📥 Descargar PDF del Hotel
                </button>
              )}
            </div>
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
