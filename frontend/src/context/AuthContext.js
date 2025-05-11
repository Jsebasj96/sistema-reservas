// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API}/api/auth/me`, { withCredentials: true });
        setUser(response.data);
      } catch (err) {
        if (err.response?.status !== 401) {
          setError('Error al verificar la sesión');
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post(
        `${API}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data);
      return response.data;
    } catch (err) {
      // Aquí "entendemos" el 400 de credenciales inválidas
      if (err.response?.status === 400) {
        setError('Credenciales inválidas');
      } else {
        setError('Error en el inicio de sesión');
      }
      throw err;   // <-- importante: lanzamos para que el componente lo capture
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      setError('Error al cerrar sesión');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthContext;
