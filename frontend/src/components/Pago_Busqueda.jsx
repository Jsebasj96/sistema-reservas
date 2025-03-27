import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PagoBusqueda = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedFlights, category, totalPrice } = location.state || {};

  if (!selectedFlights || selectedFlights.length === 0) {
    return <h2>No hay tramos seleccionados.</h2>;
  }

  // Simula el pago
  const handlePayment = () => {
    toast.success("✅ Pago exitoso. Generando ticket...");

    setTimeout(() => {
      generatePDF();
      navigate("/"); // Redirigir a la página principal después del pago
    }, 2000);
  };

  // Genera y descarga el ticket en PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Ticket de Vuelo", 80, 10);
    doc.setFontSize(12);
    doc.text(`Categoría: ${category.toUpperCase()}`, 10, 20);
    doc.text(`Total Pagado: $${totalPrice}`, 10, 30);

    // Encabezado de la tabla
    const tableColumn = ["Origen", "Destino", "Salida", "Llegada", "Precio"];
    const tableRows = [];

    selectedFlights.forEach((flight) => {
      const flightData = [
        flight.origin,
        flight.destination,
        new Date(flight.departure_time).toLocaleString(),
        new Date(flight.arrival_time).toLocaleString(),
        `$${category === "turista" ? flight.price_turista : flight.price_business}`,
      ];
      tableRows.push(flightData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });

    doc.save("Ticket_Vuelo.pdf");
  };

  return (
    <div>
      <h2>🛫 Pago de Reservas</h2>
      <h3>Resumen de Tramos Seleccionados</h3>

      <ul>
        {selectedFlights.map((flight, index) => (
          <li key={index}>
            <strong>{flight.origin} → {flight.destination}</strong><br />
            🕐 Salida: {new Date(flight.departure_time).toLocaleString()}<br />
            🕐 Llegada: {new Date(flight.arrival_time).toLocaleString()}<br />
            💰 Precio: ${category === "turista" ? flight.price_turista : flight.price_business}
          </li>
        ))}
      </ul>

      <h3>Total a Pagar: <span style={{ color: "green" }}>${totalPrice}</span></h3>

      <button onClick={handlePayment} style={{ backgroundColor: "green", color: "white", padding: "10px", marginTop: "10px" }}>
        💳 Pagar Ahora
      </button>
    </div>
  );
};

export default PagoBusqueda;