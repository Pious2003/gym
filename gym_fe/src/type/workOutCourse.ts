import { Schedule } from './schedule';

export interface WorkoutCourse {
  courseid: string;
  coursename: string;
  imageurl: string;
  personaltrainername: string;
  durationweek: number | string;
  description: string;
  schedules: string[];
  trainername?: string;
  serviceid: string;
  startDate: Date;
  endDate: Date;
}


export interface PersonalTrainer {
  id: string,
  name: string,
  specialization: string,
  experience: number
}