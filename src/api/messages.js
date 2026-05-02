import api from './axiosInstance'
export const getMessages = () => api.get('/messages').then(r => r.data)
export const getMessage = (id) => api.get(`/messages/${id}`).then(r => r.data)
export const getMessageLogs = (id) => api.get(`/messages/${id}/logs`).then(r => r.data)
export const createMessage = (payload) => api.post('/messages', payload).then(r => r.data)
export const deleteMessage = (id) => api.delete(`/messages/${id}`).then(r => r.data)
export const messageStats = () => api.get('/messages/stats').then(r => r.data)
