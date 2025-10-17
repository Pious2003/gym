export interface Schedule {
  scheduleid: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
}

export interface ScheduleFormData {
  dayOfWeek: string;
  maxParticipants: number;
  startTime: string;
  endTime: string;
}

export interface ScheduleApiResponse {
  items: Schedule[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}