import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Obtener la URL base del backend desde el .env
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Vite
// Si usas Create React App (CRA), cambia a:
// const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API}/api/auth/me`, { withCredentials: true });
        setUser(response.data);
      } catch (err) {
        setError('No se pudo verificar la sesión');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${API}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data);
    } catch (err) {
      setError('Error en el inicio de sesión');
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
