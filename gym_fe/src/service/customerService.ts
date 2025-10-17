import { Customer } from '../type/customer';
import BaseService from './baseService';
import { API_BASE } from '@/lib/utils';

const customerService = new BaseService<Customer>(`${API_BASE}/api/customer`);

export default customerService;
