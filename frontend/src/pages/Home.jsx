// src/pages/Home.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSwimmingPool, FaHotel, FaUtensils, FaSun, FaHiking, FaCalendarAlt } from 'react-icons/fa';


const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;

  return (
    <div className="font-sans text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">Club Campestre "La Buena Vida"</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#inicio" className="hover:text-green-700">Inicio</a>
            <a href="#servicios" className="hover:text-green-700">Servicios</a>
            <a href="#reservas" className="hover:text-green-700">Reservas</a>
            <a href="#pasadias" className="hover:text-green-700">Pasadías</a>
            <a href="#restaurante-bar" className="hover:text-green-700">Restaurante y Bar</a>
            <a href="#eventos" className="hover:text-green-700">Eventos</a>
            <a href="#contacto" className="hover:text-green-700">Contacto</a>
          </nav>
          <div className="space-x-3">
            <button onClick={() => navigate('/login')} className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition">Iniciar Sesión</button>
            <button onClick={() => navigate('/register')} className="px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-100 transition">Registrarse</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="inicio" className="pt-24 bg-gradient-to-br from-green-200 to-green-100 text-center">
        {message && <div className="bg-green-500 text-white p-4 rounded mb-4 max-w-xl mx-auto">{message}</div>}
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-green-800">Vive la experiencia única en el Club Campestre “La Buena Vida”</h2>
          <p className="text-lg mb-8">Naturaleza, descanso y diversión en un solo lugar.</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <button onClick={() => navigate('/reservas')} className="px-8 py-4 bg-green-700 text-white rounded-full text-xl hover:bg-green-800 transition">Reservar ahora</button>
          </div>
        </div>
      </section>

      <section id="servicios" className="bg-white py-16">
  <h3 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h3>
  <div className="overflow-x-auto px-4">
    <div className="flex gap-6 min-w-max">
      {[
        {
          title: 'Piscina',
          desc: 'Acceso a piscinas para adultos y niños.',
          icon: <FaSwimmingPool className="text-22xl text-green-700 mb-4" />,
        },
        {
          title: 'Cabañas y habitaciones',
          desc: 'Hospedaje cómodo con naturaleza.',
          icon: <FaHotel className="text-22xl text-green-700 mb-4" />,
        },
        {
          title: 'Restaurante y bar',
          desc: 'Comida tradicional y bebidas refrescantes.',
          icon: <FaUtensils className="text-22xl text-green-700 mb-4" />,
        },
        {
          title: 'Pasadías',
          desc: 'Disfruta un día completo con piscina y almuerzo.',
          icon: <FaSun className="text-22xl text-green-700 mb-4" />,
        },
        {
          title: 'Actividades recreativas',
          desc: 'Tejo, ciclas, caminatas, tenis de mesa.',
          icon: <FaHiking className="text-22xl text-green-700 mb-4" />,
        },
        {
          title: 'Eventos',
          desc: 'Alquiler de instalaciones para eventos.',
          icon: <FaCalendarAlt className="text-22xl text-green-700 mb-4" />,
        },
      ].map(({ title, desc, icon }, idx) => (
        <div key={idx} className="min-w-[250px] bg-green-50 p-6 rounded shadow hover:shadow-lg transition text-center">
          {icon}
          <h4 className="text-xl font-semibold mb-2">{title}</h4>
          <p>{desc}</p>
          <button className="mt-3 text-green-700 hover:underline">Ver más</button>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Galería */}
      <section className="py-16 px-6 bg-white">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
        Galería
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1565120130290-dfbd7c8f5b6e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1590959651323-84d26b69a014?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1555992336-cf9fc9e27c62?auto=format&fit=crop&w=800&q=80"
        ].map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Galería ${idx + 1}`}
            className="w-full h-[250px] object-cover rounded-xl shadow-lg"
          />
        ))}
      </div>
    </section>

      {/* Testimonios */}
      <section className="bg-white py-16">
        <h3 className="text-3xl font-bold text-center mb-10">Lo que dicen nuestros clientes</h3>
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              ['Ana G.', '¡Una experiencia inolvidable con mi familia!'],
              ['Carlos M.', 'La atención fue excelente, volveremos.'],
              ['Luisa R.', 'Comida deliciosa y paisajes únicos.']
            ].map(([name, quote], idx) => (
              <div key={idx} className="bg-green-100 p-6 rounded shadow text-center">
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
        <h3 className="text-3xl font-bold text-center mb-10">Promociones Especiales</h3>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            ['Semana de Relax', 'Hospédate 5 noches y paga solo 4.'],
            ['Pasadía Familiar', 'Descuento para grupos mayores a 4 personas.'],
            ['Entre Semana', '20% de descuento de lunes a jueves.']
          ].map(([title, desc], idx) => (
            <div key={idx} className="bg-white text-green-800 p-6 rounded shadow">
              <h4 className="text-xl font-bold mb-2">{title}</h4>
              <p>{desc}</p>
              <button className="mt-4 text-green-700 hover:underline">Ver promociones</button>
            </div>
          ))}
        </div>
      </section>

      {/* Formulario de contacto */}
      <section id="contacto" className="bg-white py-16">
        <h3 className="text-3xl font-bold text-center mb-10">Contáctanos</h3>
        <div className="max-w-xl mx-auto px-4">
          <form className="space-y-4">
            <input type="text" placeholder="Nombre" className="w-full border border-gray-300 rounded p-3" />
            <input type="email" placeholder="Correo" className="w-full border border-gray-300 rounded p-3" />
            <input type="tel" placeholder="Teléfono" className="w-full border border-gray-300 rounded p-3" />
            <textarea placeholder="¿En qué podemos ayudarte?" className="w-full border border-gray-300 rounded p-3 h-32" />
            <button type="submit" className="px-6 py-3 bg-green-700 text-white rounded hover:bg-green-800 transition">Enviar mensaje</button>
          </form>
        </div>
      </section>

      {/* Mapa + Info */}
      <section className="bg-green-50 py-16">
        <h3 className="text-3xl font-bold text-center mb-8">¿Dónde estamos?</h3>
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <iframe
            title="Ubicación"
            className="w-full h-80 rounded shadow"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.905092748706!2d-74.082!3d4.60971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDM2JzM0LjkiTiA3NMKwMDUnMDYuMCJX!5e0!3m2!1ses!2sco!4v1648664700000!5m2!1ses!2sco"
            loading="lazy"
          ></iframe>
          <div>
            <p><strong>Dirección:</strong> Km 10 vía al paraíso, zona campestre</p>
            <p><strong>Teléfono:</strong> +57 300 123 4567</p>
            <p><strong>Correo:</strong> info@clublabuenavida.com</p>
            <p><strong>Horario:</strong> Lunes a Domingo 8:00am – 9:00pm</p>
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
  );
};

export default Home;

