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
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center justify-center text-center px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-10">
        Bienvenido al Club Campestre "La Buena Vida"
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-green-600 text-white rounded-full text-lg hover:bg-green-700 shadow-md transition"
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => navigate('/register')}
          className="px-6 py-3 bg-white text-green-700 border border-green-600 rounded-full text-lg hover:bg-green-100 shadow-md transition"
        >
          Registrarse
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-green-800 mb-6">
        ¿Qué deseas hacer?
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl">
        <Opcion icon={<FaHotel size={40} />} texto="Reservar Cabaña" ruta="/habitaciones" />
        <Opcion icon={<FaSwimmingPool size={40} />} texto="Servicios del Club" ruta="/servicios" />
        <Opcion icon={<FaUmbrellaBeach size={40} />} texto="Pasadía" ruta="/pasadia" />
        <Opcion icon={<FaUtensils size={40} />} texto="Restaurante" ruta="/restaurante" />
        <Opcion icon={<FaCocktail size={40} />} texto="Bar" ruta="/bar" />
      </div>
    </div>
  );
};

const Opcion = ({ icon, texto, ruta }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(ruta)}
      className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-md hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105"
    >
      <div className="text-green-700 mb-2">{icon}</div>
      <span className="text-green-800 font-medium text-lg">{texto}</span>
    </div>
  );
};

export default Home;
