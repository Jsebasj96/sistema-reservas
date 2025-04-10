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
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [hotelBookingSuccess, setHotelBookingSuccess] = useState(false);
  const [hotelBookingId, setHotelBookingId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
      toast.error("❌ Error al cargar los hoteles");
    }
  };

  useEffect(() => {
    if (token) {
      fetchBooking();
    } else {
      toast.error("⚠️ No estás autenticado.");
      navigate("/login");
    }
  }, [id]);

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const res = await axios.post(
        `https://sistema-reservas-final.onrender.com/api/bookings/${id}/pay`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        toast.success("✅ Pago realizado con éxito.");
        setPaymentSuccess(true);
        fetchBooking(); // Vuelve a cargar booking con estado actualizado
        fetchHotels(res.data.booking.destination);
      }
    } catch {
      toast.error("❌ Error al procesar el pago.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleDownloadPDF = async () => {
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
    } catch {
      toast.error("❌ Error al descargar el ticket.");
    }
  };

  const handleHotelBooking = async () => {
    if (!selectedHotelId || !checkIn || !checkOut) {
      toast.warning("Por favor completa todos los datos del hotel");
      return;
    }

    try {
      const res = await axios.post(
        "https://sistema-reservas-final.onrender.com/api/hotel-bookings",
        { hotelId: selectedHotelId, checkIn, checkOut },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("🏨 Hotel reservado con éxito");
      setHotelBookingSuccess(true);
      setHotelBookingId(res.data.booking.id);
    } catch (error) {
      toast.error("❌ Error al reservar hotel");
    }
  };

  const handleDownloadHotelPDF = async () => {
    if (!hotelBookingId) return;

    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/hotel-bookings/${hotelBookingId}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `hotel_ticket_${hotelBookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error("❌ Error al descargar el PDF del hotel.");
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
              {isPaying ? "Procesando..." : `Pagar $${booking.price}`}
            </button>
          ) : (
            <>
              <button onClick={handleDownloadPDF}>📥 Descargar Ticket Vuelo</button>

              {/* 🏨 Sección de hoteles disponibles */}
              {hotels.length > 0 && (
                <>
                  <h3>🏨 Hoteles disponibles en {booking.destination}</h3>
                  <select value={selectedHotelId} onChange={(e) => setSelectedHotelId(e.target.value)}>
                    <option value="">Selecciona un hotel</option>
                    {hotels.map((hotel) => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name} - ${hotel.price_per_night} por noche
                      </option>
                    ))}
                  </select>

                  <div>
                    <label>Check-in:</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                    <label>Check-out:</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                  </div>

                  <button onClick={handleHotelBooking}>Reservar hotel</button>
                </>
              )}

              {/* ✅ Mostrar botón de descarga de hotel si ya se reservó */}
              {hotelBookingSuccess && (
                <button onClick={handleDownloadHotelPDF}>
                  📥 Descargar Ticket Hotel
                </button>
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
