import axios from 'axios';

// URL base de la API
const API_URL = '/api/auth/';

const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL + 'login', { email, password }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error en el inicio de sesión');
  }
};

const logout = async () => {
  try {
    const response = await axios.post(API_URL + 'logout', {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al cerrar sesión');
  }
};

const me = async () => {
  try {
    const response = await axios.get(API_URL + 'me', { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener el usuario');
  }
};

export const authService = {
  login,
  logout,
  me
};
