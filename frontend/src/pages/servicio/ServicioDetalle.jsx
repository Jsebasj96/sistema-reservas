// src/pages/servicio/ServicioDetalle.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ServicioDetalle() {
  const { tipo } = useParams();
  const navigate = useNavigate();

  const renderContenido = () => {
    switch (tipo) {
      case 'piscina':
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Piscina</h2>
            {/* Aquí metes fotos, recomendaciones, reglas, horarios… */}
            <p>Disfruta de nuestras piscinas para adultos y niños en un entorno natural. Horarios: 8 am–6 pm.</p>
            {/* etc. */}
          </>
        );
      case 'hospedaje':
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Cabañas y Habitaciones</h2>
            {/* Aquí muestras habitaciones y cabañas con fotos */}
            <p>Elige entre nuestras cabañas y habitaciones equipadas con todas las comodidades.</p>
            {/* etc. */}
          </>
        );
      case 'restaurante-bar':
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Restaurante y Bar</h2>
            <p>Platos a la carta, bebidas y más. Horario: 7 am–10 pm.</p>
            {/* fotos, recomendaciones… */}
          </>
        );
      case 'pasadias':
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Pasadías</h2>
            <p>Reserva tu pasadía con piscina y almuerzo.</p>
            {/* Podrías insertar aquí tu componente <Pasadias /> */}
          </>
        );
      case 'actividades':
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Actividades Recreativas</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Tenis de mesa</li>
              <li>Billar</li>
              <li>Caminatas ecológicas</li>
              <li>Alquiler de ciclas</li>
              {/* etc. */}
            </ul>
          </>
        );
      case 'eventos':
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Eventos</h2>
            <p>Alquila nuestras instalaciones para eventos familiares o corporativos.</p>
            {/* Podrías insertar aquí tu formulario de eventos */}
          </>
        );
      default:
        return <p>Servicio no encontrado.</p>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      {renderContenido()}
      <button
        onClick={() => navigate('/reserva')}
        className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800"
      >
        Reservar ahora
      </button>
    </div>
  );
}
