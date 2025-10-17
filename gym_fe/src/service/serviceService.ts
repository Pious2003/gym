import { Service } from '../type/service';
import BaseService from './baseService';
import { API_BASE, getApiHeaders } from '@/lib/utils';

const serviceService = new BaseService<Service>(`${API_BASE}/api/service`);

export default serviceService;

export async function fetchPagedServices(keyword = '', page = 1, pageSize = 5) {
    const url = `${API_BASE}/api/service/paged?keyword=${encodeURIComponent(keyword)}&page=${page}&pageSize=${pageSize}`;
    const res = await fetch(url, {
        credentials: 'include',
        headers: getApiHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch services');
    return await res.json();
}

export async function fetchAllServices() {
    const url = `${API_BASE}/api/service`;
    const res = await fetch(url, {
        credentials: 'include',
        headers: getApiHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch all services');
    return await res.json();
}