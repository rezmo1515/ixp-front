import { axiosInstance } from './axiosInstance';
export const getMessages = () => axiosInstance.get('/messages').then(r=>r.data);
export const getMessage = (id) => axiosInstance.get(`/messages/${id}`).then(r=>r.data);
export const getMessageLogs = (id) => axiosInstance.get(`/messages/${id}/logs`).then(r=>r.data);
export const sendMessage = (d) => axiosInstance.post('/messages', d).then(r=>r.data);
export const deleteMessage = (id) => axiosInstance.delete(`/messages/${id}`).then(r=>r.data);
export const getMessageStats = () => axiosInstance.get('/messages/stats').then(r=>r.data);
