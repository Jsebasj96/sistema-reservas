import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

export const obtenerIngresos = async () => {
  const res = await axios.get(`${API}/api/ingresos`, { withCredentials: true });
  return res.data;
};