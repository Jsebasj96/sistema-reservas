// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// — Configure axios baseURL and default Authorization header if token exists —
axios.defaults.baseURL = API;
const savedToken = localStorage.getItem('token');
if (savedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // 1) Al montar, comprueba el token y obtén /api/auth/me
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // Este GET ahora llevará el header Authorization
        const { data } = await axios.get('/api/auth/me');
        setUser(data.user);     // Ajusta según cómo devuelvas el user
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Error al verificar la sesión');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 2) Función de login: guarda token y configura axios
  const login = async (email, password, recaptchaToken) => {
    setError(null);
    try {
      const { data } = await axios.post('/api/auth/login', {
        email,
        password,
        recaptchaToken
      });
      // data debe contener { token, user: { … } }
      const { token, user } = data;
      // 2.1) Guárdalo en localStorage
      localStorage.setItem('token', token);
      // 2.2) Configura axios para todos los requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (err) {
      if (err.response?.status === 400) setError('Credenciales inválidas');
      else setError('Error en el inicio de sesión');
      throw err;
    }
  };

  // 3) Logout: borra token y user
  const logout = async () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthContext;
