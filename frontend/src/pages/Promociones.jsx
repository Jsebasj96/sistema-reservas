// src/pages/Promociones.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const promociones = [
  {
    id: 1,
    titulo: 'Semana de Relax',
    descripcion: 'Hospédate 5 noches y paga solo 4.',
    imagen: 'https://cdn.pixabay.com/photo/2015/09/22/13/33/velillos-951622_1280.jpg',
  },
  {
    id: 2,
    titulo: 'Pasadía Familiar',
    descripcion: 'Descuento para grupos mayores a 4 personas..',
    imagen: 'https://cdn.pixabay.com/photo/2016/11/29/04/16/beach-1867271_1280.jpg',
  },
  {
    id: 3,
    titulo: 'Entre Semana',
    descripcion: '20% de descuento de lunes a jueves.',
    imagen: 'https://cdn.pixabay.com/photo/2016/05/18/18/07/kid-1401157_1280.jpg',
  },
];

export default function Promociones() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 py-12 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-green-900">
        ¡Nuestras Ofertas Especiales!
      </h1>

      <div className="grid gap-8 md:grid-cols-3">
        {promociones.map(promo => (
          <div
            key={promo.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition"
          >
            <img
              src={promo.imagen}
              alt={promo.titulo}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-green-800">
                {promo.titulo}
              </h2>
              <p className="text-gray-700 mb-4">{promo.descripcion}</p>
              <button
                onClick={() => navigate('/reservas')}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                Reservar Ahora
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

