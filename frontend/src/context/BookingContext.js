import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const BookingContext = createContext();

const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings');
        setBookings(response.data);
      } catch (err) {
        setError('No se pudieron cargar las reservas');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, loading, error }}>
      {children}
    </BookingContext.Provider>
  );
};

export { BookingContext, BookingProvider };

