export interface Customer {
  customerID: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  type: number; // 1: Người tập, 0: PT
  status: number; // 1: Active, 0: Inactive
  createdAt?: string;
  updatedAt?: string;
  password?: string;
  gender?: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  password?: string;
  type?: number;
  status?: number;
  gender?: string;
}