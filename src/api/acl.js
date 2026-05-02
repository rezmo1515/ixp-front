import api from './axiosInstance'
export const getRoles = () => api.get('/acl/roles').then(r => r.data)
export const getPermissions = () => api.get('/acl/permissions').then(r => r.data)
export const createRole = (payload) => api.post('/acl/roles', payload).then(r => r.data)
export const updateRole = (id, payload) => api.put(`/acl/roles/${id}`, payload).then(r => r.data)
export const deleteRole = (id) => api.delete(`/acl/roles/${id}`).then(r => r.data)
