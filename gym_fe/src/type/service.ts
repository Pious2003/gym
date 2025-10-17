export interface Service {
  serviceID: string;
  serviceName: string;
  courseDescription: string;
  servicePrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceFormData {
  serviceName: string;
  courseDescription: string;
  servicePrice: number;
}

export interface ServiceFilters {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export interface ServiceResponse {
  items: Service[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}