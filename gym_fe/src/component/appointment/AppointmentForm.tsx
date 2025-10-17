import React, { useEffect, useState } from "react";

import { Calendar, Clock, FileText, User, X } from "lucide-react";

import {
  fetchCustomers,
  fetchSchedules,
  fetchServices,
  fetchStatuses,
} from "../../service/appointment";

interface AppointmentFormProps {
  appointment?: any;
  onSave: (appointment: any) => void;
  onCancel: () => void;
}

function formatTime(ts: string) {
  // Assumes ts is like "2024-07-01T08:00:00"
  return ts ? ts.split("T")[1]?.slice(0, 5) : "";
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    appointmentname: "",
    appointmentdate: "",
    appointmenttime: "",
    customerid: "",
    serviceid: "",
    statusid: "",
  });
  const [schedules, setSchedules] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    if (appointment) {
      setFormData({
        appointmentname: appointment.appointmentname,
        appointmentdate: appointment.appointmentdate
          ? (() => {
              const d = new Date(appointment.appointmentdate);
              return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                .toISOString()
                .split('T')[0];
            })()
          : "",
        appointmenttime: appointment.appointmenttime
          ? appointment.appointmenttime.slice(0, 5)
          : "",
        customerid: appointment.customerid,
        serviceid: appointment.serviceid,
        statusid: appointment.statusid,
      });
    }
    console.log("Fetching schedules...");
    fetchSchedules().then((data) => {
      console.log("Fetched schedules:", data);
      setSchedules(data);
    });
    fetchStatuses().then(setStatuses);
    fetchCustomers().then(setCustomers);
    fetchServices().then(setServices);
  }, [appointment]);

  // Helper to normalize time to HH:mm:ss
  function normalizeTime(time: string) {
    if (!time) return "00:00:00";
    // If already HH:mm:ss, return as is
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
    // If HH:mm, append :00
    if (/^\d{2}:\d{2}$/.test(time)) return time + ':00';
    // Otherwise, try to extract first 2 parts
    const parts = time.split(":");
    if (parts.length >= 2) return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
    return "00:00:00";
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get the first schedule ID from the schedules array
    const firstscheduleid = schedules.length > 0 ? (schedules[0].scheduleid || schedules[0].scheduleid) : '';

    // Format date and time as ISO strings for backend
    const appointmentData = {
      ...formData,
      appointmentdate: formData.appointmentdate + "T00:00:00",
      appointmenttime: normalizeTime(formData.appointmenttime), // always HH:mm:ss
      appointmentid: appointment?.appointmentid,
      statusid: formData.statusid || "",
    };

    // Debug log to verify payload
    console.log(
      "Submitting appointment payload:",
      JSON.stringify(appointmentData, null, 2)
    );

    onSave(appointmentData);
  };

  const handleServiceChange = (serviceid: string) => {
    setFormData({
      ...formData,
      serviceid,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {appointment ? "Chỉnh Sửa Cuộc Hẹn" : "Tạo Cuộc Hẹn Mới"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Appointment Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Tên Cuộc Hẹn
            </label>
            <input
              type="text"
              value={formData.appointmentname}
              onChange={(e) =>
                setFormData({ ...formData, appointmentname: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tên cuộc hẹn"
              required
            />
          </div>

          {/* Customer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Khách Hàng
            </label>
            <select
              value={formData.customerid}
              onChange={(e) =>
                setFormData({ ...formData, customerid: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Chọn khách hàng</option>
              {customers
                .filter((customer) => customer.type === 1)
                .map((customer) => (
                  <option
                    key={customer.customerid || customer.customerID}
                    value={customer.customerid || customer.customerID}
                  >
                    {customer.name || customer.customername} - {customer.email}
                  </option>
                ))}
            </select>
          </div>

          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dịch Vụ
            </label>
            <select
              value={formData.serviceid}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Chọn dịch vụ</option>
              {services
                .filter((service) => !!service.serviceid || !!service.serviceID)
                .map((service) => (
                  <option
                    key={service.serviceid || service.serviceID}
                    value={service.serviceid || service.serviceID}
                  >
                    {service.servicename || service.serviceName}
                    {service.serviceprice &&
                    !isNaN(parseInt(service.serviceprice))
                      ? ` - ${parseInt(service.serviceprice).toLocaleString(
                          "vi-VN"
                        )}đ`
                      : ""}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Ngày Hẹn
              </label>
              <input
                type="date"
                value={formData.appointmentdate}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentdate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Giờ Hẹn
              </label>
              <input
                type="time"
                value={formData.appointmenttime}
                onChange={(e) =>
                  setFormData({ ...formData, appointmenttime: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Remove the Price input field from the form UI */}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng Thái
            </label>
            <select
              value={formData.statusid}
              onChange={(e) =>
                setFormData({ ...formData, statusid: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Chọn trạng thái</option>
              {statuses.map((s) => (
                <option key={s.statusid} value={s.statusid}>
                  {s.statusname}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {appointment ? "Cập Nhật" : "Tạo Cuộc Hẹn"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
