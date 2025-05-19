import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'https://sistema-reservas-final.onrender.com';

const Eventos = () => {
  const { user } = useContext(AuthContext);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [tipo, setTipo] = useState('privado');
  const [mensaje, setMensaje] = useState('');

  const costoFijo = 450000;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/api/eventos`,
        {
          nombre_evento: nombre,
          descripcion,
          fecha_evento: fecha,
          tipo_evento: tipo,
          costo: costoFijo
        },
        { withCredentials: true }
      );

      setMensaje('✅ Evento registrado correctamente');
      setNombre('');
      setDescripcion('');
      setFecha('');
      setTipo('privado');
    } catch (error) {
      console.error('Error al registrar evento:', error);
      setMensaje('❌ Error al registrar evento');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="min-h-screen flex flex-col items-center bg-gray-50 py-8 px-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Registrar Evento</h2>

        <div>
          <label className="block font-medium">Nombre del Evento</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Fecha del Evento</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Tipo de Evento</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="privado">Privado</option>
            <option value="corporativo">Corporativo</option>
            <option value="social">Social</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Total a pagar</label>
          <div className="w-full px-3 py-2 rounded bg-gray-100 border text-gray-800 font-semibold">
            $450.000
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
        >
          Registrar Evento
        </button>

        {mensaje && <p className="mt-4 text-center font-medium">{mensaje}</p>}
      </form>
    </div>
  );
};

export default Eventos;

