interface Appointment {
  appointmentId: string;
  appointmentName: string;
  appointmentDate: string;
  appointmentTime: string;
  price: number;
  serviceName: string;
  scheduleInfo?: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
  status: string;
}

import { API_BASE, getApiHeaders } from '@/lib/utils';

class AppointmentService {
  private baseUrl = `${API_BASE}/api/appointment`;

  async getMyAppointments(customerId: string): Promise<Appointment[]> {
    const response = await fetch(`${this.baseUrl}/my-appointments/${customerId}`, {
      method: 'GET',
      headers: getApiHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get my appointments');
    }

    return response.json();
  }

  async getAllAppointments(): Promise<Appointment[]> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'GET',
      headers: getApiHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get appointments');
    }

    return response.json();
  }

  async createAppointment(appointmentData: any): Promise<Appointment> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: getApiHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create appointment');
    }

    return response.json();
  }

  async updateAppointment(appointmentId: string, appointmentData: any): Promise<Appointment> {
    const response = await fetch(`${this.baseUrl}/${appointmentId}`, {
      method: 'PUT',
      headers: getApiHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update appointment');
    }

    return response.json();
  }

  async deleteAppointment(appointmentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${appointmentId}`, {
      method: 'DELETE',
      headers: getApiHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete appointment');
    }
  }
}

export default new AppointmentService(); 