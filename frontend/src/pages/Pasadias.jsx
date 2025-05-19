import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Pasadias = () => {
  const { user } = useContext(AuthContext);

  const [tipoPasadia, setTipoPasadia] = useState('con_almuerzo');
  const [numPersonas, setNumPersonas] = useState(1);
  const [fecha, setFecha] = useState('');
  const [total, setTotal] = useState(0);
  const [isBooking, setIsBooking] = useState(false);

  // Calcular total automáticamente cuando cambie tipo o cantidad
  useState(() => {
    const precio = tipoPasadia === 'con_almuerzo' ? 50000 : 35000;
    setTotal(precio * numPersonas);
  }, [tipoPasadia, numPersonas]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha || !numPersonas || !tipoPasadia) {
      alert('Por favor completa todos los campos');
      return;
    }

    const reserva = {
      cliente_id: user.id,
      fecha,
      tipo_pasadia: tipoPasadia,
      total_pago: total,
    };

    setIsBooking(true);

    try {
      await axios.post('/api/pasadias', reserva, { withCredentials: true });
      alert('Reserva de pasadía realizada con éxito');
      setFecha('');
      setTipoPasadia('con_almuerzo');
      setNumPersonas(1);
      setTotal(0);
    } catch (error) {
      console.error('Error al reservar:', error);
      alert('Hubo un error al realizar la reserva');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Reserva de Pasadía</h1>

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
          <label className="block font-medium">Cantidad de personas</label>
          <input
            type="number"
            min={1}
            value={numPersonas}
            onChange={(e) => setNumPersonas(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Tipo de pasadía</label>
          <select
            value={tipoPasadia}
            onChange={(e) => setTipoPasadia(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="con_almuerzo">Con almuerzo - $50,000</option>
            <option value="sin_almuerzo">Sin almuerzo - $35,000</option>
          </select>
        </div>

        <div>
          <p className="font-semibold">Total a pagar: ${total.toLocaleString()}</p>
        </div>

        <button
          type="submit"
          disabled={isBooking}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Reservar Pasadía
        </button>
      </form>
    </div>
  );
};

export default Pasadias;
