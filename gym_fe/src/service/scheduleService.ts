import { Schedule } from '../type/schedule';
import BaseService from './baseService';
import { API_BASE } from '@/lib/utils';

const scheduleService = new BaseService<Schedule>(`${API_BASE}/api/schedule`);

export default scheduleService;