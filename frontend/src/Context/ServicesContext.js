import React, { createContext, useState, useContext } from 'react';

const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
  const [servicios, setServicios] = useState([]);
  const [selectedServicio, setSelectedServicio] = useState(null);

  const addServicio = (servicio) => {
    setServicios((prevServicios) => [...prevServicios, servicio]);
  };

  const updateServicio = (updatedServicio) => {
    setServicios((prevServicios) =>
      prevServicios.map((servicio) => (servicio.id === updatedServicio.id ? updatedServicio : servicio))
    );
  };

  const deleteServicio = (servicioId) => {
    setServicios((prevServicios) => prevServicios.filter((servicio) => servicio.id !== servicioId));
  };

  const selectServicio = (servicio) => {
    setSelectedServicio(servicio);
  };

  return (
    <ServicesContext.Provider
      value={{
        servicios,
        selectedServicio,
        addServicio,
        updateServicio,
        deleteServicio,
        selectServicio,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  return useContext(ServicesContext);
};

export default ServicesContext;
