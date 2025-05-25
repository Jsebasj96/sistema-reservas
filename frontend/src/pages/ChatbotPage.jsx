// src/pages/ChatbotPage.jsx
import React from 'react';

const ChatbotPage = () => {
  return (
    <div className="p-4 text-sm">
      <h1 className="text-lg font-bold mb-2">Asistente Virtual</h1>
      <p>👋 Hola, ¿en qué podemos ayudarte hoy?</p>
      <ul className="mt-4 space-y-2">
        <li className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer">Reservar habitación</li>
        <li className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer">Consultar disponibilidad</li>
        <li className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer">Ver promociones</li>
        <li className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer">Contactar soporte</li>
      </ul>
    </div>
  );
};

export default ChatbotPage;