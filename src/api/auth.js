import { axiosInstance } from './axiosInstance';
export const loginPassword = (payload) => axiosInstance.post('/auth/login', payload).then(r=>r.data);
export const sendOtp = (payload) => axiosInstance.post('/auth/otp/send', payload).then(r=>r.data);
export const verifyOtp = (payload) => axiosInstance.post('/auth/otp/verify', payload).then(r=>r.data);
export const registerUser = (payload) => axiosInstance.post('/auth/register', payload).then(r=>r.data);
export const logoutUser = () => axiosInstance.post('/auth/logout').then(r=>r.data);
