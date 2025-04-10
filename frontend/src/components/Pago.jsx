import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const Pago = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [hotels, setHotels] = useState([]); // 🏨 Hoteles disponibles
  const [selectedHotel, setSelectedHotel] = useState(null); // Hotel seleccionado
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchBooking = async () => {
    try {
      const res = await axios.get(
        `https://sistema-reservas-final.onrender.com/api/bookings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBooking(res.data);
      if (res.data.status === "pagado" || res.data.status === "PAID") {
        setPaymentSuccess(true);
        fetchHotels(res.data.destination); // 🔥 Cargar hoteles si ya está pagado
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        toast.success("✅ Pago realizado con éxito. Tu ticket está listo.");
        setPaymentSuccess(true);
        fetchBooking(); // Recargar datos
        fetchHotels(res.data.booking.destination); // 🔥 Cargar hoteles después del pago
      }
    } catch (error) {
      toast.error("❌ Error al procesar el pago.");
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
    if (!selectedHotel) {
      toast.warning("Selecciona un hotel para reservar.");
      return;
    }

    try {
      await axios.post(
        "https://sistema-reservas-final.onrender.com/api/hotel-bookings",
        {
          bookingId: id,
          hotelId: selectedHotel,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Reserva de hotel realizada con éxito.");
    } catch (error) {
      toast.error("❌ Error al reservar el hotel.");
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
            <button onClick={handleDownloadPDF}>
              📥 Descargar Ticket PDF
            </button>
          )}

          {/* 🏨 Mostrar hoteles disponibles después del pago */}
          {paymentSuccess && hotels.length > 0 && (
            <div className="hotel-section">
              <h3>🏨 Hoteles disponibles en {booking.destination}</h3>
              <select value={selectedHotel || ""} onChange={(e) => setSelectedHotel(e.target.value)}>
                <option value="">Selecciona un hotel</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} ({hotel.category}⭐) - {hotel.city}, {hotel.country}
                  </option>
                ))}
              </select>
              <button onClick={handleHotelBooking}>Reservar Hotel</button>
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
