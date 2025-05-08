import React, { createContext, useState, useContext } from 'react';

const PasadiaContext = createContext();

export const PasadiaProvider = ({ children }) => {
  const [pasadias, setPasadias] = useState([]);
  const [selectedPasadia, setSelectedPasadia] = useState(null);

  const addPasadia = (pasadia) => {
    setPasadias((prevPasadias) => [...prevPasadias, pasadia]);
  };

  const updatePasadia = (updatedPasadia) => {
    setPasadias((prevPasadias) =>
      prevPasadias.map((pasadia) => (pasadia.id === updatedPasadia.id ? updatedPasadia : pasadia))
    );
  };

  const deletePasadia = (pasadiaId) => {
    setPasadias((prevPasadias) => prevPasadias.filter((pasadia) => pasadia.id !== pasadiaId));
  };

  const selectPasadia = (pasadia) => {
    setSelectedPasadia(pasadia);
  };

  return (
    <PasadiaContext.Provider
      value={{
        pasadias,
        selectedPasadia,
        addPasadia,
        updatePasadia,
        deletePasadia,
        selectPasadia,
      }}
    >
      {children}
    </PasadiaContext.Provider>
  );
};

export const usePasadia = () => {
  return useContext(PasadiaContext);
};

export default PasadiaContext;
