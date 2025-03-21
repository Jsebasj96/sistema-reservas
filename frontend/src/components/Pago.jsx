import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const Pago = () => {
  const { id } = useParams(); // Capturamos el id de la reserva desde la URL
  const [booking, setBooking] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const navigate = useNavigate();

  // 🔥 Cargamos la reserva asociada
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`https://sistema-reservas-final.onrender.com/api/bookings/${id}`);
        setBooking(res.data);
      } catch (error) {
        toast.error("Error al cargar la reserva");
      }
    };
    fetchBooking();
  }, [id]);

  // 🎯 Simulamos el pago
  const handlePayment = async () => {
    setIsPaying(true);

    try {
      const res = await axios.post(`https://sistema-reservas-final.onrender.com/api/bookings/${id}/pay`);

      if (res.status === 200) {
        toast.success("✅ Pago realizado con éxito. Tu tiquete está listo.");
        setTimeout(() => navigate("/reservas"), 3000);
      }
    } catch (error) {
      toast.error("Error al procesar el pago");
    } finally {
      setIsPaying(false);
    }
  };

  // 🔥 Renderizamos la página de pago
  return (
    <div className="payment-container">
      <h2>💳 Pago de tu Reserva</h2>
  
      {booking ? (
        <>
          <p>Vuelo: {booking.origin} → {booking.destination}</p>
          <p>Categoría: {booking.category}</p>
          <p>Precio total: ${booking.price.toFixed(2)}</p>
  
          <button onClick={handlePayment} disabled={isPaying}>
            {isPaying ? "Procesando pago..." : `Pagar $${booking.price}`}
          </button>
        </>
      ) : (
        <p>Cargando reserva...</p>
      )}
  
      <button onClick={() => navigate("/reservas")}>Cancelar</button>
    </div>
  );
};

export default Pago;