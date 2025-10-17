'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, ArrowLeft, User, Mail, Phone, DollarSign } from 'lucide-react';
import AuthService from '@/service/authService';

interface CourseDetail {
  courseId: string;
  courseName: string;
  imageUrl: string;
  durationWeek: number;
  description: string;
  price: number;
  serviceName: string;
  schedules: string[];
}

interface Student {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  purchaseDate: string;
  price: number;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    if (!user || !courseId) return;
    
    // Fetch course details
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/workout-course/${courseId}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
        }
      } catch (error) {
        console.error('Failed to fetch course details:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch students who purchased this course
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const response = await fetch(`${API_BASE}/api/workout-course/students/${courseId}`);
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchCourseDetails();
    fetchStudents();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khóa học</h3>
        <p className="text-gray-600">Khóa học này không tồn tại hoặc bạn không có quyền truy cập.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Chi tiết khóa học</h1>
      </div>

      {/* Course Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Image */}
          <div>
            <img
              src={course.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
              alt={course.courseName}
              className="w-full h-64 object-cover rounded-lg border border-gray-200"
            />
          </div>

          {/* Course Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.courseName}</h2>
              <p className="text-gray-600">{course.description}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-3" />
                <span>Thời lượng: {course.durationWeek} tuần</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-5 h-5 mr-3" />
                <span>Giá: {course.price?.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Danh sách học viên ({students.length})
          </h3>
        </div>

        {loadingStudents ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Đang tải danh sách học viên...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Chưa có học viên</h4>
            <p className="text-gray-600">Chưa có học viên nào mua khóa học này.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày mua
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá đã trả
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.studentName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {student.studentEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {student.studentPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(student.purchaseDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.price?.toLocaleString('vi-VN')}₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 