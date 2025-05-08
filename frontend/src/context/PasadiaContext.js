import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const PasadiaContext = createContext();

const PasadiaProvider = ({ children }) => {
  const [pasadias, setPasadias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPasadias = async () => {
      try {
        const response = await axios.get('/api/pasadias');
        setPasadias(response.data);
      } catch (err) {
        setError('No se pudieron cargar los pasadías');
      } finally {
        setLoading(false);
      }
    };
    fetchPasadias();
  }, []);

  return (
    <PasadiaContext.Provider value={{ pasadias, loading, error }}>
      {children}
    </PasadiaContext.Provider>
  );
};

export { PasadiaContext, PasadiaProvider };

