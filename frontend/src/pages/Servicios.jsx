import React, { useState, useEffect } from 'react';
import { useServicioContext } from '../context/ServicioContext';

function Servicios() {
  const { servicios, agregarServicio } = useServicioContext();

  return (
    <div>
      <h2>Servicios Disponibles</h2>
      <ul>
        {servicios.map((servicio) => (
          <li key={servicio.id}>
            {servicio.nombre} - ${servicio.precio}
            <button onClick={() => agregarServicio(servicio)}>Agregar a cuenta</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Servicios;
