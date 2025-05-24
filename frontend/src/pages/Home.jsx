// src/pages/Home.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FaSwimmingPool,
  FaHotel,
  FaUtensils,
  FaSun,
  FaHiking,
  FaCalendarAlt,
} from 'react-icons/fa';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;
  const { user } = useContext(AuthContext);

  const handleReservarClick = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/reserva');
    }
  };

  return (
    <div className="font-sans text-gray-800">
      <div className="max-w-screen-xl mx-auto px-4">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-emerald-600 tracking-tight">
            Club Campestre "La Buena Vida"
          </h1>
          <nav className="hidden md:flex space-x-6 text-zinc-700 font-medium">
            <a href="#inicio" className="hover:text-emerald-600 transition">Inicio</a>
            <a href="#servicios" className="hover:text-emerald-600 transition">Servicios</a>
            <a href="#reservas" className="hover:text-emerald-600 transition">Reservas</a>
            <a href="#pasadias" className="hover:text-emerald-600 transition">Pasadías</a>
            <a href="#restaurante-bar" className="hover:text-emerald-600 transition">Restaurante y Bar</a>
            <a href="#eventos" className="hover:text-emerald-600 transition">Eventos</a>
            <a href="#contacto" className="hover:text-emerald-600 transition">Contacto</a>
          </nav>
          <div>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => navigate('/register')}
            className="ml-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
          >
            Registrarse
          </button>
        </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="inicio"
        className="pt-24 bg-gradient-to-br from-emerald-100 via-white to-emerald-50 text-center"
      >
        {message && (
          <div className="bg-green-500 text-white p-4 rounded mb-4 max-w-xl mx-auto">
            {message}
          </div>
        )}
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-5xl font-bold text-emerald-800 leading-tight">
            Vive la experiencia única en el Club Campestre “La Buena Vida”
          </h2>
          <p className="text-xl mt-4 text-zinc-600">
            Naturaleza, descanso y diversión en un solo lugar.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <button
              onClick={handleReservarClick}
              className="mt-8 px-10 py-4 bg-emerald-600 text-white rounded-full shadow hover:bg-emerald-700 transition-all duration-200"
            >
              Reservar ahora
            </button>
          </div>
        </div>
      </section>

      {/* Nuestros Servicios */}
      <section id="servicios" className="bg-white py-16">
        <h3 className="text-4xl font-bold text-center mb-12 text-zinc-800">Nuestros Servicios</h3>
        <div className="px-4">
        <div className="flex flex-wrap justify-center gap-16">
            {[
              {
                title: 'Piscina',
                desc: 'Acceso a piscinas para adultos y niños.',
                icon: <FaSwimmingPool className="text-4xl text-green-700 mb-4" />,
                route: '/servicios/piscina',
              },
              {
                title: 'Cabañas y habitaciones',
                desc: 'Hospedaje cómodo con naturaleza.',
                icon: <FaHotel className="text-4xl text-green-700 mb-4" />,
                route: '/servicios/hospedaje',
              },
              {
                title: 'Restaurante y bar',
                desc: 'Comida tradicional y bebidas refrescantes.',
                icon: <FaUtensils className="text-4xl text-green-700 mb-4" />,
                route: '/servicios/restaurante-bar',
              },
              {
                title: 'Pasadías',
                desc: 'Disfruta un día completo con piscina y almuerzo.',
                icon: <FaSun className="text-4xl text-green-700 mb-4" />,
                route: '/pasadias',
              },
              {
                title: 'Actividades recreativas',
                desc: 'Tejo, ciclas, caminatas, tenis de mesa.',
                icon: <FaHiking className="text-4xl text-green-700 mb-4" />,
                route: '/servicios/actividades',
              },
              {
                title: 'Eventos',
                desc: 'Alquiler de instalaciones para eventos.',
                icon: <FaCalendarAlt className="text-4xl text-green-700 mb-4" />,
                route: '/eventos',
              },
            ].map(({ title, desc, icon, route }, idx) => (
              <div
                key={idx}
                className="min-w-[250px] bg-green-50 p-6 rounded shadow hover:shadow-lg transition text-center"
              >
                {icon}
                <h4 className="text-xl font-semibold mb-2">{title}</h4>
                <p>{desc}</p>
                <Link
                  to={route}
                  className="mt-3 inline-block text-green-700 hover:underline"
                >
                  Ver más
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="overflow-x-auto py-8 bg-zinc-50">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-10">Galería</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {[
              "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            ].map((src, index) => (
              <div key={index} className="rounded-lg shadow-md overflow-hidden min-w-[320px]">
                <img
                  src={src}
                  alt={`Galeria ${index + 1}`}
                  className="w-full h-[208px] object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="bg-white py-16 mb-20">
        <div className="max-w-screen-xl mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-10">Lo que dicen nuestros clientes</h3>
        <div className="flex flex-wrap justify-center gap-16">
          {[
            ['Ana G.', '¡Una experiencia inolvidable con mi familia!'],
            ['Carlos M.', 'La atención fue excelente, volveremos.'],
            ['Luisa R.', 'Comida deliciosa y paisajes únicos.'],
          ].map(([name, quote], idx) => (
            <div
              key={idx}
              className="w-1/3 sm:w-[280px] bg-green-100 p-6 rounded shadow text-center"
            >
              <p className="italic mb-4">"{quote}"</p>
              <h5 className="font-bold">{name}</h5>
              <p>⭐⭐⭐⭐⭐</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Promociones */}
<section className="bg-green-700 text-white py-16">
  <div className="max-w-screen-xl mx-auto px-4">
    <h3 className="text-3xl font-bold text-center mb-10">Promociones Especiales</h3>
    <div className="flex flex-wrap justify-center gap-16">
      {[
        ['Semana de Relax', 'Hospédate 5 noches y paga solo 4.'],
        ['Pasadía Familiar', 'Descuento para grupos mayores a 4 personas.'],
        ['Entre Semana', '20% de descuento de lunes a jueves.'],
      ].map(([title, desc], idx) => (
        <div
          key={idx}
          className="w-1/3 sm:w-[280px] bg-white text-green-800 p-6 rounded shadow text-center"
        >
          <h4 className="text-xl font-bold mb-2">{title}</h4>
          <p>{desc}</p>
          <button
            onClick={() => navigate('/promociones')}
            className="mt-4 text-green-700 hover:underline"
          >
            Ver promociones
          </button>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Formulario de contacto */}
      <section id="contacto" className="bg-white py-16">
        <h3 className="text-3xl font-bold text-center mb-10">Contáctanos</h3>
        <div className="flex justify-center">
          <div className="w-1/3 min-w-[300px] px-4">
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full border border-gray-300 rounded p-3"
              />
              <input
                type="email"
                placeholder="Correo"
                className="w-full border border-gray-300 rounded p-3"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                className="w-full border border-gray-300 rounded p-3"
              />
              <textarea
                placeholder="¿En qué podemos ayudarte?"
                className="w-full border border-gray-300 rounded p-3 h-32"
              />
              <button
                type="submit"
                className="inline-block px-6 py-3 bg-green-700 text-white rounded hover:bg-green-800 transition"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Mapa + Info */}
      <section className="bg-green-50 py-16">
        <div className="max-w-screen-xl mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-8">¿Dónde estamos?</h3>
        <div className="flex flex-wrap justify-center gap-16">
          <iframe
            title="Ubicación"
            className="w-full h-80 rounded shadow"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.905092748706!2d-74.082!3d4.60971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDM2JzM0LjkiTiA3NMKwMDUnMDYuMCJX!5e0!3m2!1ses!2sco!4v1648664700000!5m2!1ses!2sco"
            loading="lazy"
          />
          <div>
            <p><strong>Dirección:</strong> Km 10 vía al paraíso, zona campestre</p>
            <p><strong>Teléfono:</strong> +57 300 123 4567</p>
            <p><strong>Correo:</strong> info@clublabuenavida.com</p>
            <p><strong>Horario:</strong> Lunes a Domingo 8:00am – 9:00pm</p>
          </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Club Campestre "La Buena Vida". Todos los derechos reservados.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Home;
