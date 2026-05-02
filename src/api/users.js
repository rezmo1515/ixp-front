import api from './axiosInstance'
export const getUsers = () => api.get('/users').then(r => r.data)
export const updateUser = (id, payload) => api.put(`/users/${id}`, payload).then(r => r.data)
