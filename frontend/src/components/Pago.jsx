import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const Pago = () => {
  const { id } = useParams(); // Capturamos el ID de la reserva desde la URL
  const [booking, setBooking] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // ✅ Estado para saber si se pagó
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // ✅ Obtener token

  // 🔥 Cargamos la reserva asociada
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(
          `https://sistema-reservas-final.onrender.com/api/bookings/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Enviar el token
          }
        );
        setBooking(res.data);
      } catch (error) {
        toast.error("Error al cargar la reserva");
      }
    };
    fetchBooking();
  }, [id, token]);

  // 🎯 Simulamos el pago
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
        toast.success("✅ Pago realizado con éxito. Tu tiquete está listo.");
        setPaymentSuccess(true); // ✅ Activar estado de pago exitoso
      }
    } catch (error) {
      toast.error("Error al procesar el pago");
    } finally {
      setIsPaying(false);
    }
  };

  // 📥 Descargar PDF después del pago
  const handleDownloadPDF = async () => {
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
      link.setAttribute("download", `reserva_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Error al descargar el ticket");
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

          {!paymentSuccess ? (
            <button onClick={handlePayment} disabled={isPaying}>
              {isPaying ? "Procesando pago..." : `Pagar $${booking.price}`}
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

      <button onClick={() => navigate("/reservas")}>Volver</button>
    </div>
  );
};

export default Pago;