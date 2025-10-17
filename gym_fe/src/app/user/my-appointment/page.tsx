"use client";

import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import AppointmentService from "@/service/appointmentService";
import StatusService, { AppointmentStatus } from "@/service/statusService";

export default function MyAppointmentPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [statuses, setStatuses] = useState<AppointmentStatus[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);

  useEffect(() => {
    StatusService.getStatuses()
      .then((data: AppointmentStatus[]) => {
        setStatuses(data);
        setLoadingStatuses(false);
      })
      .catch(() => setLoadingStatuses(false));
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const customerId = user?.userId;
    if (!customerId) return;
    setLoadingAppointments(true);
    AppointmentService.getMyAppointments(customerId)
      .then((data) => {
        setAppointments(data);
        setLoadingAppointments(false);
      })
      .catch((error) => {
        setLoadingAppointments(false);
      });
  }, []);

  const filteredAppointments = appointments.filter(
    (appointment) =>
      filterStatus === "all" ||
      appointment.status === filterStatus
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Cuộc hẹn của tôi
          </h3>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loadingStatuses}
          >
            <option value="all">Tất cả trạng thái</option>
            {statuses.map((status) => (
              <option key={status.statusid} value={status.statusid}>
                {status.statusname}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-6">
        {loadingAppointments ? (
          <div className="text-center text-gray-500 py-8">
            Đang tải cuộc hẹn...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Bạn chưa có cuộc hẹn nào.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.appointmentId}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {appointment.appointmentName}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {appointment.serviceName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className="text-sm font-bold px-2 py-1 rounded bg-gray-100 text-gray-900"
                  >
                    {new Date(appointment.appointmentDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                  <span
                    className="text-sm font-bold px-2 py-1 rounded bg-gray-100 text-gray-900"
                  >
                    {appointment.appointmentTime.substring(0, 5)}
                  </span>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      appointment.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-700"
                        : appointment.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {statuses.find((status) => status.statusid === appointment.status)?.statusname}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
