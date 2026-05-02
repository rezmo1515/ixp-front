import { axiosInstance } from './axiosInstance';
export const getProxyList = () => axiosInstance.get('/proxy').then(r=>r.data);
export const createProxy = (d) => axiosInstance.post('/proxy', d).then(r=>r.data);
export const deleteProxy = (domain) => axiosInstance.delete(`/proxy/${domain}`).then(r=>r.data);
