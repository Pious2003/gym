import BaseService from './baseService';
import { API_BASE, getApiHeaders } from '@/lib/utils';

// Mock data for the appointment management system

export const mockAppointments = [
  {
    appointmentid: '1',
    appointmentname: 'Cắt tóc cho An',
    appointmentdate: '2025-01-15',
    appointmenttime: '09:00',
    price: '150000',
    customerid: '1',
    serviceid: '1',
    status: true,
    scheduleid: 'sch-1'
  },
  {
    appointmentid: '2',
    appointmentname: 'Nhuộm tóc cho Bình',
    appointmentdate: '2025-01-15',
    appointmenttime: '10:30',
    price: '500000',
    customerid: '2',
    serviceid: '3',
    status: false,
    scheduleid: 'sch-2'
  },
  {
    appointmentid: '3',
    appointmentname: 'Cắt tóc cho Cường',
    appointmentdate: '2025-01-16',
    appointmenttime: '14:00',
    price: '150000',
    customerid: '3',
    serviceid: '1',
    status: false,
    scheduleid: 'sch-3'
  },
  {
    appointmentid: '4',
    appointmentname: 'Uốn tóc cho Dung',
    appointmentdate: '2025-01-16',
    appointmenttime: '15:30',
    price: '800000',
    customerid: '4',
    serviceid: '4',
    status: true,
    scheduleid: 'sch-4'
  },
  {
    appointmentid: '5',
    appointmentname: 'Gội đầu cho Em',
    appointmentdate: '2025-01-17',
    appointmenttime: '16:00',
    price: '100000',
    customerid: '5',
    serviceid: '5',
    status: false,
    scheduleid: 'sch-5'
  },
  {
    appointmentid: '6',
    appointmentname: 'Cắt tóc nữ cho Bình',
    appointmentdate: '2025-01-18',
    appointmenttime: '11:00',
    price: '200000',
    customerid: '2',
    serviceid: '2',
    status: false,
    scheduleid: 'sch-6'
  }
];

const AppointmentService = new BaseService<any>(`${API_BASE}/api/appointment`);

export async function createAppointment(appointment: any) {
  return AppointmentService.create(appointment);
}

export async function updateAppointment(appointmentId: string, appointmentData: any) {
  return AppointmentService.update(appointmentId, appointmentData);
}

export async function fetchSchedules() {
  const res = await fetch(`${API_BASE}/api/schedule`, {
    credentials: 'include',
    headers: getApiHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch schedules');
  return await res.json();
}

export async function fetchStatuses() {
  const res = await fetch(`${API_BASE}/api/status`, {
    credentials: 'include',
    headers: getApiHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch statuses');
  return await res.json();
}

export async function fetchCustomers() {
  const res = await fetch(`${API_BASE}/api/customer`, {
    credentials: 'include',
    headers: getApiHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch customers');
  return await res.json();
}

export async function fetchServices() {
  const res = await fetch(`${API_BASE}/api/service`, {
    credentials: 'include',
    headers: getApiHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch services');
  return await res.json();
}

export async function fetchAppointments() {
  const res = await fetch(`${API_BASE}/api/appointment`, {
    credentials: 'include',
    headers: getApiHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return await res.json();
}

export async function deleteAppointment(appointmentId: string) {
  const res = await fetch(`${API_BASE}/api/appointment/${appointmentId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: getApiHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete appointment');
  // No need to parse JSON for 204 No Content
  return true;
}