import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Bienvenido al Club Campestre 'La Buena Vida'</h1>
      <p>Reserva tus servicios, habitaciones y más</p>
      <nav>
        <ul>
          <li><Link to="/reservas">Reservar habitación o cabaña</Link></li>
          <li><Link to="/servicios">Servicios del Club (Restaurante/Bar)</Link></li>
          <li><Link to="/pasadias">Reservar pasadía</Link></li>
          <li><Link to="/pagos">Mis Pagos</Link></li>
          <li><Link to="/admin-dashboard">Panel de administración</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
