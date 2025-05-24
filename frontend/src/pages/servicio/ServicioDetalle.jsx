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
        <section className="servicio-detalle">
          <div className="detalle-contenido">
            <img
              src="https://cdn.pixabay.com/photo/2013/10/07/13/34/pool-191972_1280.jpg"
              alt="Piscina"
              className="detalle-imagen"
            />
            <div className="detalle-info">
              <h2 className="titulo-servicio">Piscina</h2>
              <p><strong>Horario:</strong> 8:00 am – 6:00 pm</p>
              <p><strong>Reglas:</strong> Uso obligatorio de gorro, no correr, niños bajo supervisión.</p>
              <p><strong>Recomendaciones:</strong> Llegar temprano, usar bloqueador solar, llevar hidratación.</p>
              <p>Disfruta de nuestras piscinas para adultos y niños rodeadas de naturaleza.</p>
              <BotonReservar />
            </div>
          </div>
        </section>
      );

      case 'hospedaje':
      return (
           <section className="servicio-detalle">
            <div className="detalle-contenido">
              <img
                src="https://cdn.pixabay.com/photo/2020/10/18/09/16/bedroom-5664221_1280.jpg"
                alt="Habitación"
                className="detalle-imagen"
              />
              <div className="detalle-info">
                <h2 className="titulo-servicio">Habitación Estándar</h2>
                <p>Capacidad: 2 personas. Incluye baño privado, TV, aire acondicionado.</p>
                <BotonReservar />
              </div>
            </div>
            <div className="detalle-contenido">
              <img
                src="https://media.istockphoto.com/id/2170176939/photo/cozy-and-modern-living-room-in-the-tree-house.jpg?s=2048x2048&w=is&k=20&c=n2lUqrrUsYjIm6KE_fN7W3qLR-cLoVU9QoY9fzKNX0Q="
                alt="Cabaña"
                className="detalle-imagen"
              />
              <div className="detalle-info">
                <h2 className="titulo-servicio">Cabaña Familiar</h2>
                <p>Capacidad: hasta 6 personas. Cocina equipada, zona verde, hamacas.</p>
                <BotonReservar />
              </div>
            </div>
          </section>
      );

      case 'restaurante-bar':
        return (
        <section className="servicio-detalle">
          <div className="detalle-contenido">
            <img
              src="https://cdn.pixabay.com/photo/2016/11/18/22/21/restaurant-1837150_1280.jpg"
              alt="Restaurante"
              className="detalle-imagen"
            />
            <div className="detalle-info">
              <h2 className="titulo-servicio">Restaurante y Bar</h2>
              <p><strong>Horario:</strong> 7:00 am – 10:00 pm</p>
              <p><strong>Especialidades:</strong> Bandeja paisa, sancocho, jugos naturales, cervezas nacionales.</p>
              <p><strong>Recomendaciones:</strong> Reservar mesa en fines de semana, revisar menú del día.</p>
              <BotonReservar />
            </div>
          </div>
        </section>
      );

      case 'pasadias':
        return (
        <>
        <div className="pasadia-wrapper">
          {/* Columna Izquierda: Imagen */}
          <div className="pasadia-imagen">
            <img
              src="https://cdn.pixabay.com/photo/2016/11/21/15/52/pool-1840794_1280.jpg"
              alt="Pasadía"
              className="imagen-pasadias"
            />
          </div>

          {/* Columna Derecha: Formulario + info */}
          <div className="pasadia-contenido">
            <h3 className="titulo-cta">¡Escapa de la rutina y vive un día inolvidable!</h3>
            
            <div className="info-box">
              <p><strong>Disponibilidad:</strong> Todos los días de 8:00 a.m. a 6:00 p.m.</p>
              <p><strong>Tarifa:</strong> $30.000 por persona</p>
            </div>

            <p className="descripcion">
              Disfruta de un día completo de recreación en nuestro club. Llena este formulario para reservar tu pasadía y asegurar tu cupo.
            </p>

            <ul className="beneficios">
              <li>✅ Acceso a piscinas</li>
              <li>✅ Actividades recreativas</li>
              <li>✅ Parqueadero gratuito</li>
              <li>✅ Almuerzo incluido (opcional)</li>
            </ul>

            <form className="formulario-pasadias">
              <div>
                <label className="form-label">Fecha</label>
                <input type="date" className="form-input" />
              </div>
              <div>
                <label className="form-label">Cantidad de personas</label>
                <input type="number" className="form-input" />
              </div>
              <div>
                <label className="form-label">Incluye almuerzo</label>
                <select className="form-input">
                  <option>Sí</option>
                  <option>No</option>
                </select>
              </div>
              <button type="submit" className="btn-reservar">
                Reservar pasadía
              </button>
            </form>

            <div className="testimonio-pasadias">
              “Fue un día maravilloso con mis hijos. Todo muy bien organizado.” — <strong>Laura M.</strong>
            </div>
          </div>
        </div>
      </>
      );

      case 'actividades':
        return (
           <section className="servicio-detalle">
            <div className="detalle-contenido">
              <img
                src="https://cdn.pixabay.com/photo/2021/11/15/18/47/nature-6799071_1280.jpg"
                alt="Caminatas ecológicas"
                className="detalle-imagen"
              />
              <div className="detalle-info">
                <h2 className="titulo-servicio">Caminatas ecológicas</h2>
                <p>Disfrútala sin costo adicional con tu entrada.</p>
                <BotonReservar />
              </div>
            </div>
            <div className="detalle-contenido">
              <img
                src="https://cdn.pixabay.com/photo/2019/04/23/14/23/bike-4149653_1280.jpg"
                alt="Alquiler de ciclas"
                className="detalle-imagen"
              />
              <div className="detalle-info">
                <h2 className="titulo-servicio">Alquiler de ciclas</h2>
                <p>Disfrútala sin costo adicional con tu entrada.</p>
                <BotonReservar />
              </div>
            </div>
            <div className="detalle-contenido">
              <img
                src="https://cdn.pixabay.com/photo/2016/05/31/23/21/table-tennis-1428051_1280.jpg"
                alt="Tenis de mesa"
                className="detalle-imagen"
              />
              <div className="detalle-info">
                <h2 className="titulo-servicio">Tenis</h2>
                <p>Disfrútala sin costo adicional con tu entrada.</p>
                <BotonReservar />
              </div>
            </div>
            <div className="detalle-contenido">
              <img
                src="https://cdn.pixabay.com/photo/2017/01/09/22/24/guy-playing-billiard-1967834_1280.jpg"
                alt="Billar"
                className="detalle-imagen"
              />
              <div className="detalle-info">
                <h2 className="titulo-servicio">Billar</h2>
                <p>Disfrútala sin costo adicional con tu entrada.</p>
                <BotonReservar />
              </div>
            </div>
          </section>
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
    <div className="max-w-5xl mx-auto py-8 px-4 flex flex-col items-center text-center space-y-6">
      {renderContenido()}
    </div>
  );
}

