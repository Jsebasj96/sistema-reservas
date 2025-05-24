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
      { texto: 'Ir a reservas', link: '/reservas' },
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

const ChatbotOpciones = () => {
  const [flujo, setFlujo] = useState('inicio');
  const [historial, setHistorial] = useState([{ de: 'bot', texto: flujos['inicio'].mensaje }]);

  const manejarOpcion = (opcion) => {
    if (opcion.link) {
      window.location.href = opcion.link;
    } else {
      const nuevoFlujo = flujos[opcion.siguiente];
      setHistorial([...historial, { de: 'user', texto: opcion.texto }, { de: 'bot', texto: nuevoFlujo.mensaje }]);
      setFlujo(opcion.siguiente);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 bg-white border rounded-lg shadow-lg z-50 p-4">
      <div className="h-64 overflow-y-auto space-y-3 text-sm mb-4">
        {historial.map((msg, i) => (
          <div key={i} className={msg.de === 'user' ? 'text-right' : 'text-left'}>
            <span className={`inline-block px-3 py-2 rounded ${msg.de === 'bot' ? 'bg-gray-100' : 'bg-green-200'}`}>
              {msg.texto}
            </span>
          </div>
        ))}
      </div>

      {/* Opciones del flujo actual */}
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
  );
};

export default ChatbotOpciones;