// src/components/Chatbot.jsx
import React, { useState } from 'react';

function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: '¡Hola! ¿En qué puedo ayudarte hoy?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }, { from: 'bot', text: 'Gracias por tu mensaje 😊' }]);
    setInput('');
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 bg-white shadow-lg rounded-lg border p-4 z-50">
      <div className="h-64 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.from === 'user' ? 'text-right' : 'text-left'}>
            <span className="inline-block px-3 py-1 rounded bg-gray-100 text-sm">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm"
          type="text"
          placeholder="Escribe algo..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button className="bg-blue-500 text-white px-3 rounded text-sm" onClick={handleSend}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
