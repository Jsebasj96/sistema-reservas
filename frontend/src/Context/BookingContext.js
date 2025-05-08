import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [reservas, setReservas] = useState([]);
  const [selectedReserva, setSelectedReserva] = useState(null);

  const addReserva = (reserva) => {
    setReservas((prevReservas) => [...prevReservas, reserva]);
  };

  const updateReserva = (updatedReserva) => {
    setReservas((prevReservas) =>
      prevReservas.map((reserva) => (reserva.id === updatedReserva.id ? updatedReserva : reserva))
    );
  };

  const deleteReserva = (reservaId) => {
    setReservas((prevReservas) => prevReservas.filter((reserva) => reserva.id !== reservaId));
  };

  const selectReserva = (reserva) => {
    setSelectedReserva(reserva);
  };

  return (
    <BookingContext.Provider
      value={{
        reservas,
        selectedReserva,
        addReserva,
        updateReserva,
        deleteReserva,
        selectReserva,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  return useContext(BookingContext);
};

export default BookingContext;
