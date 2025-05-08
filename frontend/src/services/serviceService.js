import axios from 'axios';

// URL base de la API para servicios
const API_URL = '/api/services/';

const getAllServices = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener los servicios');
  }
};

const createService = async (serviceData) => {
  try {
    const response = await axios.post(API_URL, serviceData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear el servicio');
  }
};

const updateService = async (id, updatedData) => {
  try {
    const response = await axios.put(API_URL + id, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el servicio');
  }
};

const deleteService = async (id) => {
  try {
    const response = await axios.delete(API_URL + id);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al eliminar el servicio');
  }
};

export const serviceService = {
  getAllServices,
  createService,
  updateService,
  deleteService
};
