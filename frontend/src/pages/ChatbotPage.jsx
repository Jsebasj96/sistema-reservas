import React, { useState } from 'react';

const flujos = {
  inicio: {
    mensaje: '¡Hola! ¿En qué puedo ayudarte hoy?',
    opciones: [
      { texto: 'Reservar habitación', siguiente: 'reservas' },
      { texto: 'Ver pasadías', siguiente: 'pasadias' },
      { texto: 'Consultar servicios', siguiente: 'servicios' },
      { texto: 'Información de contacto', siguiente: 'contacto' },
    ],
  },
  reservas: {
    mensaje: 'Puedes reservar habitaciones y cabañas desde la sección de reservas.',
    opciones: [
      { texto: 'Ir a reservas', link: '/reserva' },
      { texto: 'Volver al inicio', siguiente: 'inicio' },
    ],
  },
  pasadias: {
    mensaje: 'Ofrecemos pasadías familiares, individuales y grupales.',
    opciones: [
      { texto: 'Ver pasadías', link: '/pasadias' },
      { texto: 'Volver al inicio', siguiente: 'inicio' },
    ],
  },
  servicios: {
    mensaje: 'Contamos con piscina, restaurante, eventos y más.',
    opciones: [
      { texto: 'Ver servicios', link: '/servicios' },
      { texto: 'Volver al inicio', siguiente: 'inicio' },
    ],
  },
  contacto: {
    mensaje: 'Puedes contactarnos al 📞 300-123-4567 o al correo contacto@clubbuena.com.',
    opciones: [
      { texto: 'Volver al inicio', siguiente: 'inicio' },
    ],
  },
};

const ChatbotPage = () => {
  const [flujo, setFlujo] = useState('inicio');
  const [historial, setHistorial] = useState([
    { de: 'bot', texto: flujos['inicio'].mensaje },
  ]);

  const manejarOpcion = (opcion) => {
    if (opcion.link) {
      window.opener.location.href = opcion.link;
      window.close(); // Cierra la ventana del chatbot
    } else {
      const nuevoFlujo = flujos[opcion.siguiente];
      setHistorial([
        ...historial,
        { de: 'user', texto: opcion.texto },
        { de: 'bot', texto: nuevoFlujo.mensaje },
      ]);
      setFlujo(opcion.siguiente);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
      <h1 className="text-2xl font-semibold text-green-700 mb-4">Asistente Virtual</h1>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 flex flex-col">
        <div className="h-80 overflow-y-auto space-y-3 text-sm mb-4">
          {historial.map((msg, i) => (
            <div key={i} className={msg.de === 'user' ? 'text-right' : 'text-left'}>
              <span
                className={`inline-block px-3 py-2 rounded-lg ${
                  msg.de === 'bot' ? 'bg-gray-200 text-gray-800' : 'bg-green-300 text-green-900'
                }`}
              >
                {msg.texto}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {flujos[flujo].opciones.map((opcion, i) => (
            <button
              key={i}
              onClick={() => manejarOpcion(opcion)}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded transition"
            >
              {opcion.texto}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;