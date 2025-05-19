// src/pages/Servicios.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const categorias = [
  { key: 'piscina',         label: 'Piscina' },
  { key: 'hospedaje',       label: 'Cabañas y Habitaciones' },
  { key: 'restaurante-bar', label: 'Restaurante y Bar' },
  { key: 'pasadias',        label: 'Pasadías' },
  { key: 'actividades',     label: 'Actividades Recreativas' },
  { key: 'eventos',         label: 'Eventos' },
];

const Servicios = () => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Nuestros Servicios</h1>
      <ul className="space-y-4">
        {categorias.map(({ key, label }) => (
          <li key={key}>
            <Link
              to={`/servicios/${key}`}
              className="block p-4 bg-green-50 hover:bg-green-100 rounded shadow"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Servicios;
