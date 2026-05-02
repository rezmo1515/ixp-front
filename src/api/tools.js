import { axiosInstance } from './axiosInstance';
export const checkSite = (data) => axiosInstance.post('/crawl/check', data).then(r=>r.data);
export const pingTest = (data) => axiosInstance.post('/ping-test', data).then(r=>r.data);
export const dnsCheck = (data) => axiosInstance.post('/dns-check', data).then(r=>r.data);
export const whoisDomain = (data) => axiosInstance.post('/whois', data).then(r=>r.data);
export const whoisIp = (data) => axiosInstance.post('/whois/ip', data).then(r=>r.data);
export const getMyIp = () => axiosInstance.get('/crawl/ip').then(r=>r.data);
