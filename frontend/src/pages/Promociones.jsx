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
    descripcion: 'Descuento para grupos mayores a 4 personas.',
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
    <section className="servicio-detalle bg-gray-50 py-12 px-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-12">
        ¡Nuestras Ofertas Especiales!
      </h1>

      {promociones.map((promo) => (
        <div key={promo.id} className="detalle-contenido flex flex-col md:flex-row items-center gap-6 mb-10 max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-4">
          <img
            src={promo.imagen}
            alt={promo.titulo}
            className="w-full md:w-1/2 h-auto object-cover rounded"
          />
          <div className="detalle-info md:w-1/2">
            <h2 className="text-2xl font-bold text-green-800 mb-2">{promo.titulo}</h2>
            <p className="text-gray-700 mb-4">{promo.descripcion}</p>
            <button
              onClick={() => navigate('/reservas')}
              className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800 transition"
            >
              Reservar Ahora
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

