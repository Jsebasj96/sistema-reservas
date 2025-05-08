import axios from 'axios';

// URL base de la API para pasadías
const API_URL = '/api/pasadias/';

const createPasadia = async (pasadiaData) => {
  try {
    const response = await axios.post(API_URL, pasadiaData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear el pasadía');
  }
};

const getPasadias = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener los pasadías');
  }
};

const updatePasadia = async (id, updatedData) => {
  try {
    const response = await axios.put(API_URL + id, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el pasadía');
  }
};

const deletePasadia = async (id) => {
  try {
    const response = await axios.delete(API_URL + id);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al eliminar el pasadía');
  }
};

export const pasadiaService = {
  createPasadia,
  getPasadias,
  updatePasadia,
  deletePasadia
};
