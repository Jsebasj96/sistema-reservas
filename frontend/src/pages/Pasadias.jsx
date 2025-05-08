import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pasadias = () => {
  // Estados para manejar los pasadías y la reserva
  const [pasadias, setPasadias] = useState([]);
  const [selectedPasadia, setSelectedPasadia] = useState(null);
  const [nombre, setNombre] = useState('');
  const [documento, setDocumento] = useState('');
  const [numPersonas, setNumPersonas] = useState(0);
  const [fecha, setFecha] = useState('');
  const [total, setTotal] = useState(0);
  const [isBooking, setIsBooking] = useState(false);

  // Cargar la lista de pasadías desde el backend
  useEffect(() => {
    axios.get('/api/services/pasadias')
      .then(response => {
        setPasadias(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener los pasadías:', error);
      });
  }, []);

  // Función para seleccionar un pasadía
  const handlePasadiaSelect = (pasadia) => {
    setSelectedPasadia(pasadia);
    // Calcular el total del pasadía
    setTotal(pasadia.precio);
  };

  // Función para manejar el envío del formulario de reserva
  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!selectedPasadia || !nombre || !documento || !numPersonas || !fecha) {
      alert('Por favor complete todos los campos');
      return;
    }

    // Crear el objeto de reserva
    const reserva = {
      nombre,
      documento,
      numPersonas,
      fecha,
      pasadiaId: selectedPasadia._id,
      total
    };

    setIsBooking(true);

    // Realizar la reserva en el backend
    axios.post('/api/hotel-bookings', reserva)
      .then(response => {
        alert('Reserva realizada con éxito');
        // Limpiar los campos después de la reserva
        setNombre('');
        setDocumento('');
        setNumPersonas(0);
        setFecha('');
        setTotal(0);
        setIsBooking(false);
      })
      .catch(error => {
        alert('Hubo un error al realizar la reserva');
        console.error(error);
        setIsBooking(false);
      });
  };

  return (
    <div className="pasadias-container">
      <h1>Reserva tu Pasadía en el Club Campestre "La Buena Vida"</h1>
      
      <div className="pasadias-list">
        <h2>Pasadías Disponibles</h2>
        <div className="pasadias">
          {pasadias.map((pasadia) => (
            <div key={pasadia._id} className="pasadia-card" onClick={() => handlePasadiaSelect(pasadia)}>
              <h3>{pasadia.nombre}</h3>
              <p>{pasadia.descripcion}</p>
              <p><strong>Precio:</strong> ${pasadia.precio}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedPasadia && (
        <div className="pasadia-details">
          <h3>Detalles del Pasadía Seleccionado</h3>
          <p><strong>Nombre:</strong> {selectedPasadia.nombre}</p>
          <p><strong>Descripción:</strong> {selectedPasadia.descripcion}</p>
          <p><strong>Precio:</strong> ${selectedPasadia.precio}</p>
          
          <form onSubmit={handleBookingSubmit}>
            <h4>Reserva</h4>
            <input 
              type="text" 
              placeholder="Nombre completo" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <input 
              type="text" 
              placeholder="Número de documento" 
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              required
            />
            <input 
              type="number" 
              placeholder="Número de personas" 
              value={numPersonas}
              onChange={(e) => setNumPersonas(e.target.value)}
              required
            />
            <input 
              type="date" 
              placeholder="Fecha de reserva" 
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
            <p><strong>Total a pagar:</strong> ${total}</p>
            <button type="submit" disabled={isBooking}>Reservar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Pasadias;
