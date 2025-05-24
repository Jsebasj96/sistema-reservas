import React, { useState } from 'react';
import { IoChatbubblesOutline, IoClose } from 'react-icons/io5';

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
    mensaje: 'Puedes reservar desde la sección de reservas.',
    opciones: [
      { texto: 'Ir a reservas', link: '/reservas' },
      { texto: 'Volver al inicio', siguiente: 'inicio' },
    ],
  },
  pasadias: {
    mensaje: 'Ofrecemos pasadías individuales y familiares.',
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
    mensaje: '📞 300-123-4567\n✉️ contacto@clubbuena.com',
    opciones: [
      { texto: 'Volver al inicio', siguiente: 'inicio' },
    ],
  },
};

const ChatbotFlotante = () => {
  const [visible, setVisible] = useState(false);
  const [flujo, setFlujo] = useState('inicio');
  const [historial, setHistorial] = useState([{ de: 'bot', texto: flujos['inicio'].mensaje }]);

  const manejarOpcion = (opcion) => {
    if (opcion.link) {
      window.location.href = opcion.link;
      return;
    }
    const siguiente = flujos[opcion.siguiente];
    setHistorial([
      ...historial,
      { de: 'user', texto: opcion.texto },
      { de: 'bot', texto: siguiente.mensaje }
    ]);
    setFlujo(opcion.siguiente);
  };

  return (
    <>
      {/* Botón flotante de abrir */}
      {!visible && (
        <button
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg z-50"
          onClick={() => setVisible(true)}
          title="Abrir chat"
        >
          <IoChatbubblesOutline size={28} />
        </button>
      )}

      {/* Ventana de chat */}
      {visible && (
        <div className="fixed bottom-6 right-6 w-80 bg-white border rounded-lg shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center rounded-t-lg">
            <span className="font-semibold">Chat del Club</span>
            <button onClick={() => setVisible(false)}>
              <IoClose size={20} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="p-4 h-64 overflow-y-auto space-y-3 text-sm bg-gray-50">
            {historial.map((msg, i) => (
              <div key={i} className={msg.de === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block px-3 py-2 rounded-lg whitespace-pre-line ${msg.de === 'bot' ? 'bg-white text-gray-800 border' : 'bg-green-100 text-green-900'}`}>
                  {msg.texto}
                </div>
              </div>
            ))}
          </div>

          {/* Opciones */}
          <div className="p-3 border-t bg-white space-y-2">
            {flujos[flujo].opciones.map((op, i) => (
              <button
                key={i}
                onClick={() => manejarOpcion(op)}
                className="w-full text-sm bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
              >
                {op.texto}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotFlotante;