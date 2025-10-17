import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from "lucide-react";
import StatusService, { AppointmentStatus } from "../../service/statusService";

const statusColorMap: Record<string, string> = {
  "Đã xác nhận": "bg-green-100 text-green-800",
  "Đã hoàn thành": "bg-yellow-100 text-yellow-800",
  "Đã huỷ": "bg-red-100 text-red-700",
};

interface AppointmentCalendarProps {
  appointments: any[];
  onEditAppointment: (appointment: any) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onEditAppointment,
  onDeleteAppointment,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<AppointmentStatus[]>([]);

  useEffect(() => {
    StatusService.getStatuses().then(setStatuses);
  }, []);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getAppointmentsForDate = (date: string) => {
    console.log(appointments, date);
    return appointments.filter(
      (apt) => apt.appointmentdate.split("T")[0] === date
    );
  };

  const formatDate = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
  };

  const selectedDateAppointments = selectedDate
    ? getAppointmentsForDate(selectedDate)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-medium text-gray-600"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="p-3 h-20"></div>
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateString = formatDate(day);
              const dayAppointments = getAppointmentsForDate(dateString);
              const isToday =
                dateString === new Date().toISOString().split("T")[0];
              const isSelected = selectedDate === dateString;
              const hasAppointments = dayAppointments.length > 0;

              return (
                <div
                  key={day}
                  className={`p-2 h-20 border rounded-lg cursor-pointer transition-colors relative ${
                    isSelected
                      ? "bg-blue-100 border-blue-300"
                      : isToday
                      ? "bg-yellow-50 border-yellow-300"
                      : hasAppointments
                      ? "bg-green-50 border-green-300" // highlight days with appointments
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedDate(dateString)}
                  title={
                    hasAppointments ? `${dayAppointments.length} cuộc hẹn` : ""
                  }
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={`text-sm font-medium ${
                        isToday
                          ? "text-yellow-800"
                          : hasAppointments
                          ? "text-green-700"
                          : "text-gray-900"
                      }`}
                    >
                      {day}
                      {hasAppointments && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </span>
                    <div className="flex-1 mt-1">
                      {dayAppointments.slice(0, 2).map((apt, index) => (
                        <div
                          key={index}
                          className={`text-xs px-1 py-0.5 rounded mb-1 ${
                            apt.status
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {apt.appointmenttime}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayAppointments.length - 2} khác
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedDate ? `Ngày ${selectedDate}` : "Chọn ngày để xem chi tiết"}
          </h3>
        </div>
        <div className="p-6">
          {selectedDate ? (
            selectedDateAppointments.length > 0 ? (
              <div className="space-y-4">
                {selectedDateAppointments.map((appointment) => {
                  const statusObj = statuses.find((status) => status.statusid === appointment.statusid);
                  const statusName = statusObj?.statusname || appointment.statusid || "Không rõ";
                  const statusClass = statusColorMap[statusName] || "bg-gray-100 text-gray-800";
                  return (
                    <div
                      key={appointment.appointmentid}
                      className="border-2 border-blue-500 bg-blue-50 rounded-lg p-4 shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-blue-900">{appointment.appointmentname}</h4>
                          <p className="text-sm text-blue-700 mt-1">{appointment.appointmenttime}</p>
                          <p className="text-sm text-green-600 font-medium mt-1">
                            {parseInt(appointment.price).toLocaleString("vi-VN")}đ
                          </p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${statusClass}`}>
                            {statusName}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEditAppointment(appointment)}
                            className="p-1 hover:bg-blue-100 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => onDeleteAppointment(appointment.appointmentid)}
                            className="p-1 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Không có cuộc hẹn nào trong ngày này</p>
            )
          ) : (
            <p className="text-gray-500 text-center py-8">Chọn một ngày trên lịch để xem chi tiết</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
