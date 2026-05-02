import api from './axiosInstance'
export const login = (payload) => api.post('/auth/login', payload).then(r => r.data)
export const register = (payload) => api.post('/auth/register', payload).then(r => r.data)
export const sendOtp = (payload) => api.post('/auth/otp/send', payload).then(r => r.data)
export const verifyOtp = (payload) => api.post('/auth/otp/verify', payload).then(r => r.data)
export const logoutApi = () => api.post('/auth/logout').then(r => r.data)
