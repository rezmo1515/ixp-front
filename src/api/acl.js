import { axiosInstance } from './axiosInstance';
export const getRoles = () => axiosInstance.get('/acl/roles').then(r=>r.data);
export const createRole = (d) => axiosInstance.post('/acl/roles', d).then(r=>r.data);
export const updateRole = (id,d) => axiosInstance.put(`/acl/roles/${id}`, d).then(r=>r.data);
export const deleteRole = (id) => axiosInstance.delete(`/acl/roles/${id}`).then(r=>r.data);
export const getPermissions = () => axiosInstance.get('/acl/permissions').then(r=>r.data);
