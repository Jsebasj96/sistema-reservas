import React, { useState, useEffect } from 'react';
import { useReservaContext } from '../context/ReservaContext';
import { useNavigate } from 'react-router-dom';

function Reservas() {
  const { reservas, crearReserva } = useReservaContext();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [documento, setDocumento] = useState('');
  const [correo, setCorreo] = useState('');
  const [adultos, setAdultos] = useState(0);
  const [ninos, setNinos] = useState(0);
  const [dias, setDias] = useState(0);
  const [total, setTotal] = useState(0);

  const handleReserva = () => {
    // Lógica para crear la reserva y calcular el total
    const nuevaReserva = { nombre, documento, correo, adultos, ninos, dias, total };
    crearReserva(nuevaReserva);
    navigate('/pagos');
  };

  return (
    <div>
      <h2>Realizar Reserva</h2>
      <form onSubmit={handleReserva}>
        <input type="text" placeholder="Nombre" onChange={e => setNombre(e.target.value)} />
        <input type="text" placeholder="Número de documento" onChange={e => setDocumento(e.target.value)} />
        <input type="email" placeholder="Correo" onChange={e => setCorreo(e.target.value)} />
        <input type="number" placeholder="Adultos" onChange={e => setAdultos(e.target.value)} />
        <input type="number" placeholder="Niños" onChange={e => setNinos(e.target.value)} />
        <input type="number" placeholder="Número de días" onChange={e => setDias(e.target.value)} />
        <button type="submit">Confirmar Reserva</button>
      </form>
    </div>
  );
}

export default Reservas;
