import { axiosInstance } from './axiosInstance';
export const getUsers = () => axiosInstance.get('/users').then(r=>r.data);
export const updateUser = (id,d) => axiosInstance.put(`/users/${id}`, d).then(r=>r.data);
export const assignRole = (userId, role_id) => axiosInstance.post(`/acl/users/${userId}/role`, { role_id }).then(r=>r.data);
