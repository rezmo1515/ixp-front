import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use((r) => r, (error) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message || 'Request failed';
  if (status === 401) { useAuthStore.getState().clearAuth(); window.location.href = '/login'; }
  else if (status === 403) toast.error('Access Denied');
  else toast.error(message);
  return Promise.reject(error);
});
