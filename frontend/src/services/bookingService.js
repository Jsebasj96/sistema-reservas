import axios from 'axios';

// URL base de la API para reservas
const API_URL = '/api/hotel-bookings/';

const createReserva = async (reservaData) => {
  try {
    const response = await axios.post(API_URL, reservaData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear la reserva');
  }
};

const getReservas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener las reservas');
  }
};

const updateReserva = async (id, updatedData) => {
  try {
    const response = await axios.put(API_URL + id, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar la reserva');
  }
};

const deleteReserva = async (id) => {
  try {
    const response = await axios.delete(API_URL + id);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al eliminar la reserva');
  }
};

export const bookingService = {
  createReserva,
  getReservas,
  updateReserva,
  deleteReserva
};
