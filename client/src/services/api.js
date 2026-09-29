import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', withCredentials: true, timeout: 12000 });
api.interceptors.response.use(r => r, e => Promise.reject(new Error(e.response?.data?.message || e.message || 'Unable to reach the server.')));
export const getContent = async () => {
  const keys = ['profile','education','skills','projects','certificates','socials','resume'];
  const results = await Promise.allSettled(keys.map(key => api.get(`/${key}`)));
  return Object.fromEntries(keys.map((key,i) => [key, results[i].status === 'fulfilled' ? results[i].value.data.data : null]));
};
export default api;
