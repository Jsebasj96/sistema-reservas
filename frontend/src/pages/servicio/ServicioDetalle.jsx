// src/pages/servicio/ServicioDetalle.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ServicioDetalle() {
  const { tipo } = useParams();
  const navigate = useNavigate();

  const renderContenido = () => {
    switch (tipo) {
      case 'piscina':
        return (
          <>
            <h2 className="text-3xl font-bold mb-4">Piscina</h2>
            <div className="flex justify-center">
              <img src="https://cdn.pixabay.com/photo/2013/10/07/13/34/pool-191972_1280.jpg" alt="Piscina" className="w-[100px] h-[100px] object-cover rounded" style={{ maxWidth: '100%', height: 'auto' }} />
              <p><strong>Horario:</strong> 8:00 am – 6:00 pm</p>
              <p><strong>Reglas:</strong> Uso obligatorio de gorro, no correr, niños bajo supervisión.</p>
              <p><strong>Recomendaciones:</strong> Llegar temprano, usar bloqueador solar, llevar hidratación.</p>
              <p>Disfruta de nuestras piscinas para adultos y niños rodeadas de naturaleza.</p>
            </div>
            <BotonReservar />
          </>
        );

      case 'hospedaje':
        return (
          <>
            <h2 className="text-3xl font-bold mb-6">Cabañas y Habitaciones</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border rounded p-4">
                <img src="https://cdn.pixabay.com/photo/2020/10/18/09/16/bedroom-5664221_1280.jpg" alt="Habitación" className="mb-2 rounded" />
                <h3 className="text-xl font-semibold">Habitación Estándar</h3>
                <p>Capacidad: 2 personas. Incluye baño privado, TV, aire acondicionado.</p>
              </div>
              <div className="border rounded p-4">
                <img src="https://media.istockphoto.com/id/2170176939/photo/cozy-and-modern-living-room-in-the-tree-house.jpg?s=2048x2048&w=is&k=20&c=n2lUqrrUsYjIm6KE_fN7W3qLR-cLoVU9QoY9fzKNX0Q=" alt="Cabaña" className="mb-2 rounded" />
                <h3 className="text-xl font-semibold">Cabaña Familiar</h3>
                <p>Capacidad: hasta 6 personas. Cocina equipada, zona verde, hamacas.</p>
              </div>
            </div>
            <BotonReservar />
          </>
        );

      case 'restaurante-bar':
        return (
          <>
            <h2 className="text-3xl font-bold mb-4">Restaurante y Bar</h2>
            <div className="space-y-4">
              <img src="https://cdn.pixabay.com/photo/2016/11/18/22/21/restaurant-1837150_1280.jpg" alt="Restaurante" className="rounded" />
              <p><strong>Horario:</strong> 7:00 am – 10:00 pm</p>
              <p><strong>Especialidades:</strong> Bandeja paisa, sancocho, jugos naturales, cervezas nacionales.</p>
              <p><strong>Recomendaciones:</strong> Reservar mesa en fines de semana, revisar menú del día.</p>
            </div>
            <BotonReservar />
          </>
        );

      case 'pasadias':
        return (
          <>
            <h2 className="text-3xl font-bold mb-4">Reserva de Pasadía</h2>
            <form className="space-y-4 max-w-xl">
              <div>
                <label className="block font-medium">Fecha</label>
                <input type="date" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium">Cantidad de personas</label>
                <input type="number" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium">Incluye almuerzo</label>
                <select className="w-full border rounded px-3 py-2">
                  <option>Sí</option>
                  <option>No</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
              >
                Reservar pasadía
              </button>
            </form>
          </>
        );

      case 'actividades':
        return (
          <>
            <h2 className="text-3xl font-bold mb-4">Actividades Recreativas</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { nombre: 'Caminatas ecológicas', img: 'https://cdn.pixabay.com/photo/2021/11/15/18/47/nature-6799071_1280.jpg' },
                { nombre: 'Alquiler de ciclas', img: 'https://cdn.pixabay.com/photo/2019/04/23/14/23/bike-4149653_1280.jpg' },
                { nombre: 'Tenis de mesa', img: 'https://cdn.pixabay.com/photo/2016/05/31/23/21/table-tennis-1428051_1280.jpg' },
                { nombre: 'Billar', img: 'https://cdn.pixabay.com/photo/2017/01/09/22/24/guy-playing-billiard-1967834_1280.jpg' },
              ].map((a, i) => (
                <div key={i} className="border rounded p-4">
                  <img src={a.img} alt={a.nombre} className="mb-2 rounded" />
                  <h3 className="text-lg font-semibold">{a.nombre}</h3>
                  <p>Disfrútala sin costo adicional con tu entrada.</p>
                </div>
              ))}
            </div>
            <BotonReservar />
          </>
        );

      case 'eventos':
        return (
          <>
            <h2 className="text-3xl font-bold mb-4">Reserva de Eventos</h2>
            <form className="space-y-4 max-w-xl">
              <div>
                <label className="block font-medium">Tipo de evento</label>
                <input type="text" className="w-full border rounded px-3 py-2" placeholder="Ej: Cumpleaños, boda" />
              </div>
              <div>
                <label className="block font-medium">Fecha</label>
                <input type="date" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium">Cantidad de personas</label>
                <input type="number" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium">Observaciones</label>
                <textarea className="w-full border rounded px-3 py-2" rows={3} />
              </div>
              <button
                type="submit"
                className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
              >
                Reservar evento
              </button>
            </form>
          </>
        );

      default:
        return <p>Servicio no encontrado.</p>;
    }
  };

  const BotonReservar = () => (
    <button
      onClick={() => navigate('/reserva')}
      className="mt-6 px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800"
    >
      Reservar ahora
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {renderContenido()}
    </div>
  );
}

