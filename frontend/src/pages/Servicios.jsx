import React from 'react';
import { useServicioContext } from '../context/ServicioContext';

const Servicios = () => {
  const { servicios, loading, error } = useServicioContext();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Servicios del Club</h1>
      <ul>
        {servicios.map(servicio => (
          <li key={servicio.id}>{servicio.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default Servicios;
