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
    <section className="servicio-detalle">
      <h1 className="titulo-principal">¡Nuestras Ofertas Especiales!</h1>

      {promociones.map((promo) => (
        <div key={promo.id} className="detalle-contenido">
          <img
            src={promo.imagen}
            alt={promo.titulo}
            className="detalle-imagen"
          />
          <div className="detalle-info">
            <h2 className="titulo-servicio">{promo.titulo}</h2>
            <p>{promo.descripcion}</p>
            <button
              className="boton-reservar"
              onClick={() => navigate('/reservas')}
            >
              Reservar Ahora
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
