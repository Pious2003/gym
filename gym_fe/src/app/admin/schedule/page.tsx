"use client";
import React, { useEffect, useState } from "react";

import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  Edit2,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import scheduleService from "../../../service/scheduleService";
import { Schedule, ScheduleFormData } from "../../../type/schedule";

interface ToastNotification {
  id: string;
  type: "success" | "error" | "warning";
  message: string;
  visible: boolean;
}

const ScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDay, setFilterDay] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add" | null>(
    null
  );
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [formData, setFormData] = useState<ScheduleFormData>({
    dayOfWeek: "Thứ 2",
    maxParticipants: 2,
    startTime: "",
    endTime: "",
  });

  const daysOfWeek = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ Nhật",
  ];

  const fetchSchedules = async () => {
    try {
      const params: Record<string, string | number> = {
        keyword: searchTerm.trim(),
        page: currentPage,
        pageSize,
      };
      if (filterDay !== "all") {
        params.dayOfWeek = filterDay;
      }
      const res = await scheduleService.getPaged(params);
      setSchedules(res.items);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      showNotification("error", "Không thể tải danh sách lịch trình");
    }
  };

  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, currentPage, pageSize, filterDay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      dayOfWeek: formData.dayOfWeek,
      maxParticipants: formData.maxParticipants,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };
    try {
      if (modalMode === "edit" && selectedSchedule) {
        await scheduleService.update(selectedSchedule.scheduleid, payload);
        showNotification("success", "Cập nhật lịch trình thành công!");
      } else {
        await scheduleService.create(payload);
        showNotification("success", "Thêm lịch trình thành công!");
      }

      fetchSchedules();
      setShowAddModal(false);
      setFormData({
        dayOfWeek: "Thứ 2",
        maxParticipants: 2,
        startTime: "",
        endTime: "",
      });
      setSelectedSchedule(null);
      setModalMode(null);
    } catch (err) {
      showNotification("error", "Có lỗi xảy ra khi lưu dữ liệu");
      console.error("Submit error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await scheduleService.delete(id);
      fetchSchedules();
      showNotification("success", "Xóa lịch trình thành công!");
    } catch (err) {
      showNotification("error", "Có lỗi xảy ra khi xóa lịch trình");
      console.error("Delete failed:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxParticipants" ? parseInt(value) : value,
    }));
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowViewModal(false);
    setFormData({
      dayOfWeek: "Thứ 2",
      maxParticipants: 20,
      startTime: "",
      endTime: "",
    });
    setSelectedSchedule(null);
    setModalMode(null);
  };

  const formatTime = (timeString: string) => {
    if (/^\d{2}:\d{2}$/.test(timeString)) return timeString;
    return "";
  };

  const getDayColor = (day: string) => {
    const colors = {
      "Thứ 2": "bg-blue-100 text-blue-800",
      "Thứ 3": "bg-green-100 text-green-800",
      "Thứ 4": "bg-yellow-100 text-yellow-800",
      "Thứ 5": "bg-purple-100 text-purple-800",
      "Thứ 6": "bg-red-100 text-red-800",
      "Thứ 7": "bg-orange-100 text-orange-800",
      "Chủ Nhật": "bg-pink-100 text-pink-800",
    };
    return colors[day as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const showNotification = (
    type: "success" | "error" | "warning",
    message: string
  ) => {
    const id = Date.now().toString();
    const notification: ToastNotification = {
      id,
      type,
      message,
      visible: true,
    };

    setNotifications((prev) => [...prev, notification]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, visible: false } : n))
      );

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 300);
    }, 4000);
  };
  // Khi mở modal edit, tự động load dữ liệu cũ vào form
  useEffect(() => {
    if (modalMode === "edit" && selectedSchedule) {
      setFormData({
        dayOfWeek: selectedSchedule.dayOfWeek,
        maxParticipants: selectedSchedule.maxParticipants,
        startTime: selectedSchedule.startTime, // gán trực tiếp chuỗi hh:mm
        endTime: selectedSchedule.endTime,     // gán trực tiếp chuỗi hh:mm
      });
    }
  }, [modalMode, selectedSchedule]);
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`transform transition-all duration-300 ease-in-out ${
              notification.visible
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div
              className={`flex items-center p-4 rounded-lg shadow-lg min-w-80 ${
                notification.type === "success"
                  ? "bg-green-50 border-l-4 border-green-400"
                  : notification.type === "error"
                  ? "bg-red-50 border-l-4 border-red-400"
                  : "bg-yellow-50 border-l-4 border-yellow-400"
              }`}
            >
              {notification.type === "success" && (
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              )}
              {notification.type === "error" && (
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              )}
              {notification.type === "warning" && (
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
              )}
              <span
                className={`text-sm font-medium ${
                  notification.type === "success"
                    ? "text-green-800"
                    : notification.type === "error"
                    ? "text-red-800"
                    : "text-yellow-800"
                }`}
              >
                {notification.message}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Schedule Management
            </h1>
          </div>
          <button
            onClick={() => {
              setShowAddModal(true);
              setModalMode("add");
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Thêm lịch trình</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm lịch trình..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-gray-900 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              <select
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                className="text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả ngày</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <button className="text-gray-700 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Lọc nâng cao</span>
              </button>
              <button className="text-gray-700 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Xuất dữ liệu
              </button>
            </div>
          </div>
        </div>

        {/* Schedules Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày trong tuần
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lượng tối đa
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedules.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg font-medium">
                        Không tìm thấy lịch trình nào
                      </p>
                      <p className="text-sm">
                        Hãy thêm lịch trình mới để bắt đầu
                      </p>
                    </td>
                  </tr>
                ) : (
                  schedules.map((schedule) => (
                    <tr
                      key={schedule.scheduleid}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <CalendarDays className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getDayColor(
                                schedule.dayOfWeek
                              )}`}
                            >
                              {schedule.dayOfWeek}
                            </span>
                            <div className="text-sm text-gray-500 mt-1">
                              ID: {schedule.scheduleid}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatTime(schedule.startTime)} -{" "}
                            {formatTime(schedule.endTime)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {schedule.maxParticipants} người
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              setShowViewModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              setFormData({
                                dayOfWeek: schedule.dayOfWeek,
                                maxParticipants: schedule.maxParticipants,
                                startTime: schedule.startTime,
                                endTime: schedule.endTime,
                              });
                              setModalMode("edit");
                              setShowAddModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 transition-colors p-2 hover:bg-green-50 rounded-lg"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.scheduleid)}
                            className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-lg">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Trang <span className="font-medium">{currentPage}</span> /{" "}
              <span className="font-medium">{totalPages}</span>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-gray-900 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="5">5 / trang</option>
                <option value="10">10 / trang</option>
                <option value="20">20 / trang</option>
              </select>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + Math.max(1, currentPage - 2);
                if (pageNum > totalPages) return null;
                return pageNum <= totalPages ? (
                  <button
                    key={`page-${pageNum}`}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      pageNum === currentPage
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ) : null;
              })}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Schedule Modal */}
        {showAddModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {modalMode === "edit"
                      ? "Chỉnh sửa lịch trình"
                      : "Thêm lịch trình mới"}
                  </h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-white hover:bg-opacity-50 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Day of Week */}
                  <div>
                    <label
                      htmlFor="dayofweek"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      Ngày trong tuần
                    </label>
                    <div className="relative">
                      <CalendarDays className="h-5 w-5 text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <select
                        id="dayofweek"
                        name="dayOfWeek"
                        value={formData.dayOfWeek}
                        onChange={handleInputChange}
                        required
                        className="text-gray-900 w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
                      >
                        {daysOfWeek.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Time Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="starttime"
                        className="block text-sm font-semibold text-gray-700 mb-3"
                      >
                        Thời gian bắt đầu
                      </label>
                      <div className="relative">
                        <Clock className="h-5 w-5 text-green-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="time"
                          id="starttime"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          required
                          className="text-gray-900 w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="endtime"
                        className="block text-sm font-semibold text-gray-700 mb-3"
                      >
                        Thời gian kết thúc
                      </label>
                      <div className="relative">
                        <Clock className="h-5 w-5 text-red-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="time"
                          id="endtime"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          required
                          className="text-gray-900 w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Max Participants */}
                  <div>
                    <label
                      htmlFor="maxparticipants"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      Số lượng tối đa
                    </label>
                    <div className="relative">
                      <Users className="h-5 w-5 text-purple-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="number"
                        id="maxparticipants"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleInputChange}
                        min="1"
                        max="100"
                        required
                        className="text-gray-900 w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Nhập số lượng tối đa..."
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end space-x-4 pt-6 mt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading
                      ? "Đang lưu..."
                      : modalMode === "edit"
                      ? "Lưu thay đổi"
                      : "Thêm lịch trình"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Schedule Modal */}
        {showViewModal && selectedSchedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Chi tiết lịch trình
                  </h2>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-white hover:bg-opacity-50 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        ID lịch trình
                      </label>
                      <p className="mt-1 text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg">
                        {selectedSchedule.scheduleid}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Ngày trong tuần
                      </label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getDayColor(
                            selectedSchedule.dayOfWeek
                          )}`}
                        >
                          {selectedSchedule.dayOfWeek}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Thời gian
                      </label>
                      <div className="mt-1 flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">
                          {formatTime(selectedSchedule.startTime)} -{" "}
                          {formatTime(selectedSchedule.endTime)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Số lượng tối đa
                      </label>
                      <div className="mt-1 flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">
                          {selectedSchedule.maxParticipants} người
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleManagement;
