import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const { user, loading, error, login } = useContext(AuthContext);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [localError, setLocalError]     = useState(null);
  const navigate = useNavigate();

  // Redirigir si ya está logueado
  useEffect(() => {
    if (!loading && user) {
      console.log('✅ [Login] Usuario logueado, redirigiendo a /');
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLocalError(null);
    console.log('⏳ [Login] Enviando credenciales:', { email, password });
    try {
      await login(email, password);
      console.log('🔐 [Login] login() completado');
      // La redirección la hace el useEffect
    } catch (err) {
      console.log('❌ [Login] login() lanzó error', err);
      setLocalError('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-3 border border-green-400 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-3 border border-green-400 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-3 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
        {(error || localError) && (
          <p className="text-red-600 mt-2 text-center">
            {localError || error}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;

