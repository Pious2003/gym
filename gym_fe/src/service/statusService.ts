import { getApiHeaders } from '@/lib/utils';

export interface AppointmentStatus {
  statusid: string;
  statusname: string;
}

class StatusService {
  private baseUrl = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5231'}/api/status`;

  async getStatuses(): Promise<AppointmentStatus[]> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'GET',
      headers: getApiHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get appointment statuses');
    }

    return response.json();
  }
}

export default new StatusService();
