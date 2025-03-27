import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const Pago = () => {
  const { id } = useParams(); // Capturamos el ID de la reserva desde la URL
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
      setBooking(res.data);

      // Si la reserva ya está pagada, activar `paymentSuccess`
      if (res.data.status === "pagado") {
        setPaymentSuccess(true);
      }
    } catch (error) {
      toast.error("❌ Error al cargar la reserva");
    }
  };

  // Cargar la reserva al montar el componente
  useEffect(() => {
    if (token) {
      fetchBooking();
    } else {
      toast.error("⚠️ No estás autenticado.");
      navigate("/login");
    }
  }, [id, token, navigate]);

  // Simular pago
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

  // Descargar PDF después del pago
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

  // Renderizar la página de pago
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
        </>
      ) : (
        <p>Cargando reserva...</p>
      )}

      <button onClick={() => navigate("/reservas")}>🔙 Volver</button>
    </div>
  );
};

export default Pago;