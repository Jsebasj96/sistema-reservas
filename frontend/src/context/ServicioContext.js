import React, { createContext, useState, useEffect } from 'react';
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

export { ServicioContext, ServicioProvider };

