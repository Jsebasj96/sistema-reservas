import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { crearPasadia } from '../services/pasadiasService'; // Servicio que crearemos

const PasadiaForm = () => {
  const { user } = useContext(AuthContext);

  const [fecha, setFecha] = useState('');
  const [tipoPasadia, setTipoPasadia] = useState('con_almuerzo'); // opción por defecto
  const [cantidadPersonas, setCantidadPersonas] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const total = calcularTotal(tipoPasadia, cantidadPersonas);

    const pasadiaData = {
      cliente_id: user.id,
      fecha,
      tipo_pasadia: tipoPasadia,
      total_pago: total,
    };

    try {
      await crearPasadia(pasadiaData);
      alert('¡Pasadía reservada con éxito!');
    } catch (error) {
      console.error('Error al reservar pasadía:', error);
      alert('Error al reservar pasadía');
    }
  };

  const calcularTotal = (tipo, cantidad) => {
    const precioBase = tipo === 'con_almuerzo' ? 50000 : 35000;
    return precioBase * cantidad;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <h2 className="text-3xl font-bold mb-4">Reserva de Pasadía</h2>

      <div>
        <label className="block font-medium">Fecha</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Cantidad de personas</label>
        <input
          type="number"
          min={1}
          className="w-full border rounded px-3 py-2"
          value={cantidadPersonas}
          onChange={(e) => setCantidadPersonas(Number(e.target.value))}
        />
      </div>

      <div>
        <label className="block font-medium">Tipo de pasadía</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={tipoPasadia}
          onChange={(e) => setTipoPasadia(e.target.value)}
        >
          <option value="con_almuerzo">Con almuerzo</option>
          <option value="sin_almuerzo">Sin almuerzo</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
      >
        Reservar pasadía
      </button>
    </form>
  );
};

export default PasadiaForm;
