import React from 'react';
import { useReservaContext } from '../context/ReservaContext';

const Reserva = () => {
  const { reservas, loading, error } = useReservaContext();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Reservas del Club</h1>
      <ul>
        {reservas.map(reserva => (
          <li key={reserva.id}>{reserva.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default Reserva;
