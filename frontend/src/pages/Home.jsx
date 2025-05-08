import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHotel,
  FaSwimmingPool,
  FaUmbrellaBeach,
  FaUtensils,
  FaCocktail,
} from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-green-300 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-8 drop-shadow-md text-center">
        Bienvenido al Club Campestre <br />"La Buena Vida"
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-green-700 text-white rounded-full text-lg hover:bg-green-800 shadow-lg transition-all duration-200"
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => navigate('/register')}
          className="px-6 py-3 bg-white text-green-700 border-2 border-green-700 rounded-full text-lg hover:bg-green-100 shadow-lg transition-all duration-200"
        >
          Registrarse
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-green-900 mb-6">¿Qué deseas hacer?</h2>

      <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl px-4">
        <Opcion icon={<FaHotel size={50} />} texto="Reservar Cabaña" ruta="/Reserva" />
        <Opcion icon={<FaSwimmingPool size={50} />} texto="Servicios del Club" ruta="/Servicios" />
        <Opcion icon={<FaUmbrellaBeach size={50} />} texto="Pasadía" ruta="/Pasadias" />
        <Opcion icon={<FaUtensils size={50} />} texto="Restaurante" ruta="/restaurante" />
        <Opcion icon={<FaCocktail size={50} />} texto="Bar" ruta="/bar" />
      </div>
    </div>
  );
};

const Opcion = ({ icon, texto, ruta }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(ruta)}
      className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center transform hover:scale-105 hover:shadow-2xl transition duration-300 cursor-pointer"
    >
      <div className="text-green-600 mb-3">{icon}</div>
      <p className="text-lg font-semibold text-green-800">{texto}</p>
    </div>
  );
};

export default Home;
