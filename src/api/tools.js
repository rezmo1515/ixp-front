import api from './axiosInstance'
export const checkSite = (payload) => api.post('/crawl/check', payload).then(r => r.data)
export const pingTest = (payload) => api.post('/ping-test', payload).then(r => r.data)
export const dnsCheck = (payload) => api.post('/dns-check', payload).then(r => r.data)
export const whoisDomain = (payload) => api.post('/whois', payload).then(r => r.data)
export const whoisIp = (payload) => api.post('/whois/ip', payload).then(r => r.data)
export const getMyIp = () => api.get('/crawl/ip').then(r => r.data)
