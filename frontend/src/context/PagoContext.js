import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const PagoContext = createContext();

const PagoProvider = ({ children }) => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await axios.get('/api/pagos');
        setPagos(response.data);
      } catch (err) {
        setError('No se pudieron cargar los pagos');
      } finally {
        setLoading(false);
      }
    };
    fetchPagos();
  }, []);

  return (
    <PagoContext.Provider value={{ pagos, loading, error }}>
      {children}
    </PagoContext.Provider>
  );
};

// Exportar el hook para consumir el contexto
export const usePagoContext = () => useContext(PagoContext);
export { PagoProvider };
