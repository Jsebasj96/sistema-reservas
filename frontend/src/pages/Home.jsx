import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    console.log('🔀 [Home] Navegando a /login');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-green-300 flex flex-col items-center justify-center px-6 py-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-10 drop-shadow-md text-center">
        Bienvenido al Club Campestre <br />"La Buena Vida."
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        <button
          onClick={goToLogin}
          className="px-8 py-4 bg-green-700 text-white rounded-full text-xl font-semibold shadow-lg transform hover:bg-green-800 hover:scale-105 transition-all duration-300"
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => {
            console.log('🔀 [Home] Navegando a /register');
            navigate('/register');
          }}
          className="px-8 py-4 bg-white text-green-700 border-2 border-green-700 rounded-full text-xl font-semibold shadow-lg transform hover:bg-green-100 hover:scale-105 transition-all duration-300"
        >
          Registrarse
        </button>
      </div>
    </div>
  );
};

export default Home;
