import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Pasadias = () => {
  const { user } = useContext(AuthContext);

  const [tipoPasadia, setTipoPasadia] = useState('con_almuerzo');
  const [cantidad, setCantidad] = useState(1);
  const [fecha, setFecha] = useState('');
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState('');

  // Calcular total automático
  useEffect(() => {
    const precioBase = tipoPasadia === 'con_almuerzo' ? 50000 : 35000;
    setTotal(precioBase * cantidad);
  }, [tipoPasadia, cantidad]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha) {
      alert('Por favor elige una fecha.');
      return;
    }

    try {
      await axios.post(
        '/api/pasadias',
        {
          fecha,
          tipo_pasadia: tipoPasadia,
          cantidad_personas: cantidad,
          total_pago: total
        },
        { withCredentials: true }
      );

      setMensaje('✅ Pasadía reservada con éxito');
    } catch (error) {
      console.error('Error al reservar pasadía:', error);
      setMensaje('❌ Error al reservar pasadía');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Reserva de Pasadía</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Tipo de Pasadía</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={tipoPasadia}
            onChange={(e) => setTipoPasadia(e.target.value)}
          >
            <option value="con_almuerzo">Con almuerzo</option>
            <option value="sin_almuerzo">Sin almuerzo</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Cantidad de personas</label>
          <input
            type="number"
            min={1}
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <p className="font-semibold">Total a pagar: ${total.toLocaleString()}</p>
        </div>

        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Reservar
        </button>

        {mensaje && <p className="mt-4 font-medium">{mensaje}</p>}
      </form>
    </div>
  );
};

export default Pasadias;


