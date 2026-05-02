import api from './axiosInstance'
export const getProxies = () => api.get('/proxy').then(r => r.data)
export const createProxy = (payload) => api.post('/proxy', payload).then(r => r.data)
export const deleteProxy = (domain) => api.delete(`/proxy/${domain}`).then(r => r.data)
