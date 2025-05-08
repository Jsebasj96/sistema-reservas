import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ServicioContext = createContext();

const ServicioProvider = ({ children }) => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get('/api/servicios');
        setServicios(response.data);
      } catch (err) {
        setError('No se pudieron cargar los servicios');
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, []);

  return (
    <ServicioContext.Provider value={{ servicios, loading, error }}>
      {children}
    </ServicioContext.Provider>
  );
};

// Exportar el hook para consumir el contexto
export const useServicioContext = () => useContext(ServicioContext);
export { ServicioProvider };



