// src/components/ChatbotModal.jsx
import React from 'react';

const ChatbotModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Fondo transparente (opcional) */}
      <div className="absolute inset-0" />

      {/* Ventana flotante del chatbot */}
      <div className="absolute bottom-4 right-4 w-80 h-96 bg-white shadow-2xl border rounded-lg z-50 flex flex-col pointer-events-auto">
        <div className="bg-green-700 text-white p-3 flex justify-between items-center rounded-t-lg">
          <span>Asistente Virtual</span>
          <button onClick={onClose} className="text-white font-bold">✕</button>
        </div>
        <div className="flex-1 p-3 overflow-y-auto text-sm">
          <p className="mb-2">👋 Hola, ¿en qué podemos ayudarte?</p>
          <ul className="space-y-2">
            <li className="bg-gray-100 p-2 rounded hover:bg-gray-200 cursor-pointer">Reservar habitación</li>
            <li className="bg-gray-100 p-2 rounded hover:bg-gray-200 cursor-pointer">Consultar disponibilidad</li>
            <li className="bg-gray-100 p-2 rounded hover:bg-gray-200 cursor-pointer">Ver promociones</li>
            <li className="bg-gray-100 p-2 rounded hover:bg-gray-200 cursor-pointer">Contactar soporte</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;
