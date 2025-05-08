import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const PagoContext = createContext();

const PagoProvider = ({ children }) => {
  const [pago, setPago] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPago = async () => {
      try {
        const response = await axios.get('/api/pagos');
        setPago(response.data);
      } catch (err) {
        setError('No se pudo cargar la información de pago');
      } finally {
        setLoading(false);
      }
    };
    fetchPago();
  }, []);

  return (
    <PagoContext.Provider value={{ pago, loading, error }}>
      {children}
    </PagoContext.Provider>
  );
};

export { PagoContext, PagoProvider };

