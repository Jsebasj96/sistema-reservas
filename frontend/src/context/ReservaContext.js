import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ReservaContext = createContext();

const ReservaProvider = ({ children }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await axios.get('/api/reservas');
        setReservas(response.data);
      } catch (err) {
        setError('No se pudieron cargar las reservas');
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  }, []);

  return (
    <ReservaContext.Provider value={{ reservas, loading, error }}>
      {children}
    </ReservaContext.Provider>
  );
};

// Exportar el hook para consumir el contexto
export const useReservaContext = () => useContext(ReservaContext);
export { ReservaProvider };


