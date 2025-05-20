// src/services/reservasService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/reservas/`
  : '/api/reservas/';

const crearReserva = async (reservaData) => {
  try {
    const { data } = await axios.post(API_URL, reservaData, {
      withCredentials: true,
    });
    // tu controlador responde { reserva: {...} }
    return data.reserva;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al crear la reserva');
  }
};

const obtenerReservas = async () => {
  try {
    const { data } = await axios.get(API_URL, {
      withCredentials: true,
    });
    // tu controlador responde { reservas: [...] }
    return data.reservas;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al obtener las reservas');
  }
};

// Opcional: si más adelante añades un PUT en tu backend
// const actualizarReserva = async (id, updatedData) => {
//   try {
//     const { data } = await axios.put(`${API_URL}${id}`, updatedData, {
//       withCredentials: true,
//     });
//     return data.reserva;
//   } catch (error) {
//     throw new Error(error.response?.data?.error || 'Error al actualizar la reserva');
//   }
// };

const eliminarReserva = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}${id}`, {
      withCredentials: true,
    });
    return data; // tu controlador devuelve { message, reserva }
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al eliminar la reserva');
  }
};

export const reservasService = {
  crearReserva,
  obtenerReservas,
  // actualizarReserva,
  eliminarReserva,
};
