import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#333', color: '#fff' }}>
      <Link to="/" style={{ color: '#fff', marginRight: '1rem' }}>Inicio</Link>
      <Link to="/reservas" style={{ color: '#fff', marginRight: '1rem' }}>Reservas</Link>
      <Link to="/pasadias" style={{ color: '#fff', marginRight: '1rem' }}>Pasadías</Link>
      <Link to="/servicios" style={{ color: '#fff', marginRight: '1rem' }}>Servicios</Link>
    </nav>
  );
};

export default Navbar;

