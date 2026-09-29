import axios from 'axios';

const getApiBaseUrl = () => {
  const raw = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
  return raw.endsWith('/api') ? raw : `${raw}/api`;
};

export const API_BASE_URL = getApiBaseUrl();
export const SOCKET_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

const api = axios.create({ 
  baseURL: API_BASE_URL, 
  withCredentials: true, 
  timeout: 15000 
});

api.interceptors.response.use(
  r => r, 
  e => Promise.reject(new Error(e.response?.data?.message || e.message || 'Unable to reach the server.'))
);

export const getContent = async () => {
  const keys = ['profile','education','skills','projects','certificates','socials','resume'];
  const results = await Promise.allSettled(keys.map(key => api.get(`/${key}`)));
  return Object.fromEntries(keys.map((key,i) => [key, results[i].status === 'fulfilled' ? results[i].value.data.data : null]));
};

export default api;

