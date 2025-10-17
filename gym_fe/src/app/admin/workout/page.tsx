'use client';
import React, {
  useMemo,
  useState,
} from 'react';

import {
  Award,
  BookOpen,
  Clock,
  Dumbbell,
  Plus,
  Users,
} from 'lucide-react';

import { AddCourseModal } from '../../../component/workout/AddCourseModal';
import CourseCard from '../../../component/workout/CourseCard';
import { fetchAllServices } from '../../../service/serviceService';
import { Service } from '../../../type/service';
import { CourseModal } from '../../../component/workout/CourseModal';
import { SearchFilter } from '../../../component/workout/SearchFilter';
import { StatsCard } from '../../../component/workout/StatsCard';
import {
  createWorkoutCourse,
  fetchTrainers,
  fetchWorkoutCourses,
  updateWorkoutCourse,
} from '../../../service/workOutCourse';
import { Customer } from '../../../type/customer';
import { WorkoutCourse } from '../../../type/workOutCourse';

function Workout() {
  const [courses, setCourses] = useState<WorkoutCourse[]>([]);
  const [trainers, setTrainers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<WorkoutCourse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<WorkoutCourse | null>(null);

  // Mở modal update
  const handleEditCourse = (course: WorkoutCourse) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);
  };
  // Đóng modal update
  const handleCloseEditModal = () => {
    setEditingCourse(null);
    setIsEditModalOpen(false);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterByDuration, setFilterByDuration] = useState('');

  React.useEffect(() => {
    Promise.all([
      fetchWorkoutCourses().then(setCourses),
      fetchTrainers().then(setTrainers),
      fetchAllServices().then(setServices),
    ]).finally(() => setLoading(false));
  }, []);

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter(course =>
      (course.coursename || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.trainername || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterByDuration) {
      filtered = filtered.filter(course => {
        switch (filterByDuration) {
          case 'short':
            return course.durationweek <= 8;
          case 'medium':
            return course.durationweek > 8 && course.durationweek <= 12;
          case 'long':
            return course.durationweek > 12;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.coursename || '').localeCompare(b.coursename || '');
        case 'duration':
          return a.durationweek - b.durationweek;
        case 'trainer':
          return (a.trainername || '').localeCompare(b.trainername || '');
        default:
          return 0;
      }
    });
  }, [courses, searchTerm, sortBy, filterByDuration]);

  const handleViewDetails = (course: WorkoutCourse) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleAddCourse = async (newCourseData: Omit<WorkoutCourse, 'courseid'>) => {
    try {
      await createWorkoutCourse(newCourseData);
      const updated = await fetchWorkoutCourses();
      setCourses(updated);
    } catch (e) {
      alert('Failed to add course');
    }
  };

  const totalDuration = courses.reduce((sum, course) => sum + (course.durationweek || 0), 0);
  const avgDuration = courses.length > 0 && totalDuration > 0 ? Math.round(totalDuration / courses.length) : 0;
  const uniqueTrainers = new Set(courses.map(course => course.personaltrainername)).size;

  if (loading) {
    return <div className="flex justify-center items-center h-96 text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Dumbbell className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold">Workout Courses</h1>
              </div>
              <p className="text-xl opacity-90 max-w-2xl">
                Khám phá các chương trình thể dục tuyệt vời được thiết kế bởi các huấn luyện viên chuyên nghiệp để giúp bạn đạt được mục tiêu của mình.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Course
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Courses"
            value={courses.length}
            icon={BookOpen}
            color="bg-purple-500"
          />
          <StatsCard
            title="Active Trainers"
            value={uniqueTrainers}
            icon={Users}
            color="bg-blue-500"
          />
          <StatsCard
            title="Avg Duration"
            value={`${avgDuration} weeks`}
            icon={Clock}
            color="bg-green-500"
          />
          <StatsCard
            title="Success Rate"
            value="94%"
            icon={Award}
            color="bg-orange-500"
          />
        </div>

        {/* Search and Filter */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterByDuration={filterByDuration}
          onFilterChange={setFilterByDuration}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredAndSortedCourses.length}</span> of{' '}
            <span className="font-semibold">{courses.length}</span> courses
          </p>
        </div>

        {/* Course Grid */}
        {filteredAndSortedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredAndSortedCourses.map((course) => {
              const service = services.find(s => s.serviceID === course.serviceid);
              return (
                <CourseCard
                  key={course.courseid}
                  course={course}
                  service={service}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEditCourse}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy khóa học nào</h3>
            <p className="text-gray-600">
              Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc để tìm kiếm lại.
            </p>
          </div>
        )}
      </div>

      {/* Edit Course Modal */}
      <AddCourseModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onAddCourse={async (data) => {
          if (!editingCourse) return;
          try {
            await updateWorkoutCourse({
              courseId: editingCourse.courseid,
              courseName: data.coursename,
              imageUrl: data.imageurl,
              personalTrainerId: data.personaltrainer,
              durationWeek: data.durationweek,
              description: data.description,
              personalTrainerName: data.trainername,
              price: data.price,
              serviceId: data.serviceid,
              schedules: data.schedules,
            });
            const updated = await fetchWorkoutCourses();
            setCourses(updated);
            handleCloseEditModal();
          } catch (e) {
            console.error(e);
            // alert('Cập nhật thất bại!');
          }
        }}
        trainers={trainers}
        initialData={editingCourse}
      />

      {/* Course Modal */}
      <CourseModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Add Course Modal */}
      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCourse={handleAddCourse}
        trainers={trainers}
      />
    </div>
  );
}

export default Workout;