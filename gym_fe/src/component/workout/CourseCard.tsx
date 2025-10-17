import React from 'react';

import {
  Clock,
  Info,
  User,
  Pen,
} from 'lucide-react';

import { WorkoutCourse } from '../../types/workOutCourse';
import { Service } from '../../type/service';

interface CourseCardProps {
  course: WorkoutCourse;
  service?: Service;
  onViewDetails: (course: WorkoutCourse) => void;
  onEdit: (course: WorkoutCourse) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, service, onViewDetails, onEdit }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        <img
          src={course.imageurl || course.imageUrl}
          alt={course.coursename || course.courseName}
          className="w-full h-48 object-cover"
        />
        {service && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-700 shadow">
            <div>Dịch vụ: <span className="font-semibold">{service.serviceName}</span></div>
            <div>Giá: <span className="font-semibold">{service.servicePrice.toLocaleString()}₫</span></div>
          </div>
        )}
        <button
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-blue-100 transition"
          onClick={e => {
            e.stopPropagation();
            onEdit(course);
          }}
          title="Chỉnh sửa khoá tập"
        >
          <Pen className="w-5 h-5 text-blue-600" />
        </button>
        <div className="absolute top-4 right-14 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
          {(course.durationweek || course.durationWeek) + ' weeks'}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {course.coursename || course.courseName}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        <div className="flex flex-col gap-1 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{course.trainername || course.personaltrainername}</span>
          </div>
          {course.specialization && (
            <div className="flex items-center gap-1">
              <span>Specialization:</span>
              <span>{course.specialization}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.durationweek || course.durationWeek} weeks</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-semibold text-gray-700">Giá:</span>
          <span className="text-green-600 font-bold">{course.price ? Number(course.price).toLocaleString('vi-VN') + 'đ' : '0đ'}</span>
        </div>
        <button
          onClick={() => onViewDetails(course)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Info className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );
};

export default CourseCard;