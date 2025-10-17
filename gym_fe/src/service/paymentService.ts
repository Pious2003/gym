import { API_BASE, APP_URL, getApiHeaders } from '@/lib/utils';
// src/service/paymentService.ts

interface CheckoutItem {
  Name: string;
  Price: number;
}

interface CheckoutSessionRequest {
  Items: CheckoutItem[];
  Origin: string;
  CustomerId: string;
}

interface SavePaymentItem {
  id: string;
  coursename: string;
  price: number;
}

interface SavePaymentRequest {
  Items: SavePaymentItem[];
  CustomerId: string;
}

interface PaymentResponse {
  url?: string;
  message?: string;
}

interface Course {
  courseid: string;
  coursename: string;
  imageurl: string;
  personaltrainerid: string;
  durationweek: number;
  description: string;
  price: number;
  serviceid: string;
  schedules: string[];
}
export interface Schedule {
  scheduleid: string;
  dayOfWeek: string;
  maxParticipants: number;
  startTime: string;
  endTime: string;
  courseId: string;
  courseName: string;
  teacherName: string;
}

export type ScheduleDetail = {
  scheduleid: string;
  dayOfWeek: 'Chủ nhật' | 'Thứ 2' | 'Thứ 3' | 'Thứ 4' | 'Thứ 5' | 'Thứ 6' | 'Thứ 7';
  startTime: string; // Format: 'HH:mm'
  endTime: string;   // Format: 'HH:mm'
};

export type ScheduleResponse = {
  courseId: string;
  teacherName: string;
  courseName: string;
  courseStartDate: string; // ISO format date string
  courseEndDate: string;   // ISO format date string
  duration: number;        // in weeks
  schedules: Schedule[];
};
interface PaymentHistory {
  paymentId: string;
  courseId: string;
  courseName: string;
  instructor: string;
  amount: number;
  originalAmount: number;
  status: string;
  date: string;
  paymentMethod: string;
  transactionId: string;
  discount: number;
  paidAt: string;
}

class PaymentService {
  private baseUrl = `${API_BASE}/api/payment`;

  async createCheckoutSession(request: CheckoutSessionRequest): Promise<PaymentResponse> {
    const response = await fetch(`${this.baseUrl}/create-checkout-session`, {
      method: 'POST',
      headers: getApiHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    return response.json();
  }

  async savePayment(request: SavePaymentRequest): Promise<PaymentResponse> {
    const response = await fetch(`${this.baseUrl}/save`, {
      method: 'POST',
      headers: getApiHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save payment');
    }

    return response.json();
  }

  async getMyCourses(customerId: string): Promise<Course[]> {
    const response = await fetch(`${this.baseUrl}/my-courses/${customerId}`, {
      method: 'GET',
      credentials: 'include',
      headers: getApiHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get my courses');
    }

    return response.json();
  }

  async getMySchedules(customerId: string): Promise<ScheduleResponse[]> {
    const response = await fetch(`${this.baseUrl}/my-schedules/${customerId}`, {
      method: 'GET',
      credentials: 'include',
      headers: getApiHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get my schedules');
    }

    return response.json();
  }

  async getPaymentHistory(customerId: string): Promise<PaymentHistory[]> {
    const response = await fetch(`${this.baseUrl}/history/${customerId}`, {
      method: 'GET',
      credentials: 'include',
      headers: getApiHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get payment history');
    }

    return response.json();
  }

  async getUserStats(customerId: string): Promise<{ totalPackages: number; totalSpent: number }> {
    const response = await fetch(`${API_BASE}/api/dashboard/user-stats/` + customerId, {
      method: 'GET',
      credentials: 'include',
      headers: getApiHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get user stats');
    }
    return response.json();
  }
}


export default new PaymentService();
export type { PaymentHistory }; 