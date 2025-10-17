"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  X,
  Zap,
  Target,
  CurrencyIcon,
  BookCheck,
  LoaderPinwheel,
} from "lucide-react";
import AuthService from "@/service/authService";
import {
  format,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import PaymentService, {
  Schedule,
  ScheduleResponse,
} from "@/service/paymentService";
import { useEffect as useEffectReact, useState as useStateReact } from "react";
import { fetchAllServices } from "../../../service/serviceService";
import { Service } from "../../../type/service";

const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

import { useSearchParams } from "next/navigation";
import { ScheduleCourse } from "../page";
import { DAY_OF_WEEK } from "@/utils/date.utils";

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const [services, setServices] = useStateReact<Service[]>([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [schedules, setSchedules] = useState<
    (ScheduleCourse & { validDates: string[] })[]
  >([]);
  const [scheduleCourse, setScheduleCourse] = useState<ScheduleResponse[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  // Modal state
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  // State for selected date in calendar view
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Set viewMode based on ?tab=calendar in URL
  useEffectReact(() => {
    const tab = searchParams.get("tab");
    if (tab === "calendar") {
      setViewMode("calendar");
    }
  }, [searchParams]);

  useEffectReact(() => {
    fetchAllServices().then(setServices);
  }, []);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) return;
    const customerId = user.userId || user.customerID;
    setLoadingCourses(true);
    setLoadingSchedules(true);
    PaymentService.getMyCourses(customerId)
      .then((data) => {
        setMyCourses(data);
        setLoadingCourses(false);
      })
      .catch((error) => {
        console.error("Failed to get courses:", error);
        setLoadingCourses(false);
      });
    PaymentService.getMySchedules(customerId)
      .then((data) => {
        setScheduleCourse(data);

        const formattedData: (ScheduleCourse & { validDates: string[] })[] =
          data.reduce((acc, course: ScheduleResponse) => {
            const schedules = course.schedules.map((schedule) => {
              const inRangeDates = [];

              const startDate = new Date(course.courseStartDate);
              const endDate = new Date(course.courseEndDate);

              let currentDate = startDate;

              while (currentDate <= endDate) {
                inRangeDates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
              }

              const validDates = inRangeDates
                .filter((date) => {
                  if (
                    schedule.dayOfWeek ===
                    DAY_OF_WEEK[date.getDay() as keyof typeof DAY_OF_WEEK]
                  ) {
                    return date;
                  }
                })
                .map((date) => format(date, "yyyy-MM-dd"));

              return {
                id: schedule.scheduleid,
                dayOfWeek: schedule.dayOfWeek,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                courseName: course.courseName,
                courseStartDate: course.courseStartDate,
                courseEndDate: course.courseEndDate,
                teacherName: course.teacherName,
                courseId: course.courseId,
                validDates,
              };
            });
            acc.push(...schedules);
            return acc;
          }, [] as any[]);

        setSchedules(formattedData);
        setLoadingSchedules(false);
      })
      .catch((error) => {
        console.error("Failed to get schedules:", error);
        setLoadingSchedules(false);
      });
  }, []);

  const generateCalendarDays = () => {
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const hasSchedule = (date: Date) => {
    return schedules?.some((s) => {
      return s.validDates.includes(format(date, "yyyy-MM-dd"));
    });
  };

  const calendarDays = generateCalendarDays();

  const handleViewDetails = (course: any) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Khoá tập của tôi</h1>
        <p className="text-blue-100 text-lg">
          Quản lý và theo dõi các buổi tập của bạn
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Danh sách
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "calendar"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Lịch
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "calendar" && (
        /* Calendar View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {format(currentDate, "MMMM yyyy")}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setMonth(currentDate.getMonth() - 1))
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Hôm nay
              </button>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setMonth(currentDate.getMonth() + 1))
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const valid = hasSchedule(day);
              return (
                <div
                  key={index}
                  className={[
                    "p-3 text-center text-sm border transition-colors cursor-pointer",
                    isSelected ? "bg-blue-50 text-blue-600 font-medium" : "",
                    valid
                      ? "bg-blue-100 text-blue-700 font-semibold border-blue-300"
                      : "border-gray-100 hover:bg-gray-50",
                  ].join(" ")}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="relative">
                    {format(day, "d")}
                    {valid && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Schedule details for selected day */}
          {selectedDate && (
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-2 text-blue-700 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Lịch tập ngày {format(selectedDate, "dd/MM/yyyy")}
              </h4>
              <ul className="space-y-3">
                {schedules.filter((sch) => {
                  const valid =
                    sch.dayOfWeek ===
                      DAY_OF_WEEK[
                        new Date(
                          selectedDate
                        ).getDay() as keyof typeof DAY_OF_WEEK
                      ] &&
                    isBefore(selectedDate, new Date(sch.courseEndDate)) &&
                    isAfter(selectedDate, new Date(sch.courseStartDate));
                  return valid;
                }).length === 0 ? (
                  <li className="text-gray-500 italic">
                    Không có lịch tập nào cho ngày này.
                  </li>
                ) : (
                  schedules
                    .filter((sch) => {
                      const valid =
                        sch.dayOfWeek ===
                          DAY_OF_WEEK[
                            new Date(
                              selectedDate
                            ).getDay() as keyof typeof DAY_OF_WEEK
                          ] &&
                        isBefore(selectedDate, new Date(sch.courseEndDate)) &&
                        isAfter(selectedDate, new Date(sch.courseStartDate));
                      return valid;
                    })
                    .map((sch, idx) => (
                      <li
                        key={idx}
                        className="bg-white max-w-fit border border-gray-100 rounded-lg px-4 py-3 flex-col md:flex-row md:items-center md:justify-between gap-2"
                      >
                        <div className="">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-blue-800">
                              Khoá tập: {sch.courseName || "Lớp tập"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Users className="w-4 h-4" />
                            <span>Huấn luyện viên: {sch.teacherName}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-800">
                            {sch.startTime} - {sch.endTime}
                          </span>
                        </div>
                      </li>
                    ))
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {viewMode === "list" && (
        /* List View */
        <div className="space-y-4">
          {/* My Courses */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-extrabold mb-6 text-blue-700 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Khoá tập đã mua
            </h2>
            {loadingCourses ? (
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Đang tải khoá học...
              </div>
            ) : myCourses.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-gray-500">
                <XCircle className="w-10 h-10 mb-2 text-gray-300" />
                <span className="text-lg font-medium">
                  Bạn chưa mua khoá học nào.
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.map((course, idx) => {
                  const service = services.find(
                    (s) => s.serviceID === course.serviceId
                  );

                  const servicePrice = service?.servicePrice ?? 0;
                  const serviceName = service?.serviceName;

                  const {
                    courseId,
                    courseName,
                    imageUrl,
                    durationWeek,
                    ptName,
                    price,
                  } = course;

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col"
                    >
                      <div className="relative mb-3">
                        <img
                          src={
                            imageUrl ||
                            "https://placehold.co/320x180?text=No+Image"
                          }
                          alt={courseName}
                          className="w-full h-40 object-cover rounded-lg border border-gray-200"
                        />
                        <span className="absolute top-2 right-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-semibold shadow">
                          {durationWeek} tuần
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                          {courseName}
                        </div>
                        <div className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {course.description}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <Users className="w-4 h-4" />
                          <span>PT: {ptName ? ptName : "Chưa có"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <Clock className="w-4 h-4" />
                          <span>Thời lượng: {durationWeek} tuần</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <BookCheck className="w-4 h-4" />
                          <span>
                            Dịch vụ: {serviceName ? serviceName : "Không rõ"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          <CurrencyIcon className="w-4 h-4" />
                          <span>
                            Giá dịch vụ: {servicePrice.toLocaleString()}₫
                          </span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-base font-bold text-blue-600">
                            {price.toLocaleString("vi-VN")}₫
                          </span>
                          <button
                            className="px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition"
                            onClick={() =>
                              handleViewDetails({
                                ...course,
                                servicePrice,
                                price: price,
                              })
                            }
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {myCourses.length === 0 && !loadingCourses && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có khoá tập
              </h3>
            </div>
          )}
          {loadingCourses && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                <LoaderPinwheel className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Đang tải khoá tập...
              </h3>
            </div>
          )}
        </div>
      )}

      {/* Course Detail Modal */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-2xl p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Chi tiết khoá học
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Image and Basic Info */}
                <div className="space-y-6">
                  {/* Course Image */}
                  <div className="relative">
                    <img
                      src={
                        selectedCourse.imageUrl ||
                        "https://placehold.co/600x400?text=No+Image"
                      }
                      alt={selectedCourse.courseName}
                      className="w-full h-64 object-cover rounded-xl border border-gray-200"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Đã mua
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Thời lượng</p>
                          <p className="font-semibold text-gray-900">
                            {selectedCourse.durationWeek} tuần
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 text-green-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Trạng thái</p>
                          <p className="font-semibold text-gray-900">
                            Đang học
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Giá khoá học</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedCourse.price?.toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  {/* Course Name and Description */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {selectedCourse.courseName}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedCourse.description ||
                        "Không có mô tả chi tiết cho khoá học này."}
                    </p>
                  </div>

                  {/* Instructor Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Thông tin huấn luyện viên
                    </h4>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">
                          {selectedCourse.ptName
                            ? selectedCourse.ptName.charAt(0)
                            : "P"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedCourse.ptName || "Chưa có thông tin"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Personal Trainer
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-green-600" />
                      Thông tin dịch vụ
                    </h4>
                    <p className="text-gray-700">
                      {selectedCourse.serviceName ||
                        "Không có thông tin dịch vụ"}
                    </p>
                    <p className="text-gray-700">
                      {selectedCourse.servicePrice?.toLocaleString("vi-VN") +
                        "₫" || 0}
                    </p>
                  </div>

                  {/* Course Features */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-orange-600" />
                      Đặc điểm khoá học
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>
                          Thời lượng: {selectedCourse.durationWeek} tuần
                        </span>
                      </div>
                      {/* <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Hỗ trợ 1-1 với PT</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Lịch tập linh hoạt</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Chứng chỉ hoàn thành</span>
                      </div> */}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {/* <div className="flex space-x-3 pt-4">
                    <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Bắt đầu học
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                      Liên hệ PT
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
