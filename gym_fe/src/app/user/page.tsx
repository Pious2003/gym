"use client";

import "react-chatbot-kit/build/main.css";

import React, { useEffect, useState } from "react";

import {
  Award,
  Calendar,
  MessageCircle,
  Target,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import Chatbot from "react-chatbot-kit";

import AuthService from "@/service/authService";
import PaymentService, { ScheduleResponse } from "@/service/paymentService";
import AppointmentService from "@/service/appointmentService";
import QuickActionButtons from "@/component/QuickActionButtons";

import ActionProvider from "./ActionProvider";
import config from "./config";
import MessageParser from "./MessageParser";
import Link from "next/link";
import {
  isSameDay,
  isTodayValidForCourse,
  DAY_OF_WEEK,
  isWithinCurrentWeek,
} from "@/utils/date.utils";
import { format, isToday, isWithinInterval } from "date-fns";

export type ScheduleCourse = {
  id: string;
  dayOfWeek:
    | "Chủ nhật"
    | "Thứ 2"
    | "Thứ 3"
    | "Thứ 4"
    | "Thứ 5"
    | "Thứ 6"
    | "Thứ 7";
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
  courseName: string;
  courseStartDate: string; // ISO format e.g., '2025-08-03T00:00:00Z'
  courseEndDate: string; // ISO format
  teacherName: string;
  courseId: string;
};

export default function UserDashboard() {
  const router = require("next/navigation").useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const user = AuthService.getCurrentUser();
  const [showChatbot, setShowChatbot] = React.useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [stats, setStats] = useState([
    {
      name: "Khóa học đã mua",
      value: "Đang tải...",
      change: "",
      changeType: "neutral",
      icon: Trophy,
    },
    {
      name: "Tổng tiền đã chi",
      value: "Đang tải...",
      change: "",
      changeType: "neutral",
      icon: Award,
    },
  ]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // State for schedules
  const [schedules, setSchedules] = useState<ScheduleCourse[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  // State for appointments
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) return;
    const customerId = user.userId || user.customerID;

    // Fetch user stats
    setStatsLoading(true);
    setStatsError(null);
    PaymentService.getUserStats(customerId)
      .then((data) => {
        setStats((prev) => [
          {
            ...prev[0],
            value: data.totalPackages?.toLocaleString("vi-VN") ?? "0",
            change: prev[0].change,
            changeType: "increase",
          },
          {
            ...prev[1],
            value:
              data.totalSpent !== undefined
                ? data.totalSpent.toLocaleString("vi-VN") + "₫"
                : "0₫",
            change: prev[1].change,
            changeType: "increase",
          },
          ...prev.slice(2),
        ]);
        setStatsLoading(false);
      })
      .catch((error) => {
        setStats((prev) => [
          { ...prev[0], value: "Lỗi" },
          { ...prev[1], value: "Lỗi" },
          ...prev.slice(2),
        ]);
        setStatsError("Không thể tải thống kê người dùng");
        setStatsLoading(false);
      });

    // Fetch schedules
    setLoadingSchedules(true);
    PaymentService.getMySchedules(customerId)
      .then((data) => {
        const formattedData: ScheduleCourse[] = data.reduce(
          (acc, course: ScheduleResponse) => {
            const schedules = course.schedules.map((schedule) => ({
              id: schedule.scheduleid,
              dayOfWeek: schedule.dayOfWeek,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              courseName: course.courseName,
              courseStartDate: course.courseStartDate,
              courseEndDate: course.courseEndDate,
              teacherName: course.teacherName,
              courseId: course.courseId,
            }));
            acc.push(...schedules);
            return acc;
          },
          [] as any[]
        );

        console.log(formattedData);

        setSchedules(formattedData);
        setLoadingSchedules(false);
      })
      .catch((error) => {
        setLoadingSchedules(false);
      });
    AppointmentService.getMyAppointments(customerId)
      .then((data) => {
        setAppointments(data);
        setLoadingAppointments(false);
      })
      .catch((error) => {
        setLoadingAppointments(false);
      });
  }, []);

  return (
    <div className="space-y-8 container">
      {/* Floating Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowChatbot(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label="Open chat bot"
        >
          <MessageCircle className="w-9 h-9" />
        </button>
      </div>
      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setShowChatbot(false)}
            aria-label="Đóng chat bot"
          />
          {/* Modal */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto z-10 animate-fadeInUp"
            style={{ margin: "24px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowChatbot(false)}
              className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 z-20"
              aria-label="Đóng chat bot"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-0 sm:p-4 w-full">
              <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
              />
            </div>
          </div>
        </div>
      )}
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-500 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">
            Chào mừng trở lại, {hasMounted ? user?.name || "User" : "..."}!
          </h1>
          <p className="text-emerald-100 text-lg">
            Hôm nay bạn có{" "}
            {
              schedules.filter((s) =>
                isTodayValidForCourse({
                  courseStartDate: s.courseStartDate,
                  courseEndDate: s.courseEndDate,
                  dayOfWeek: s.dayOfWeek,
                })
              ).length
            }{" "}
            buổi tập. Hãy cùng chinh phục mục tiêu fitness của mình!
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="#schedule"
              className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("schedule");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Xem lịch tập
            </a>
            <Link
              href="/user/buy"
              className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-800 transition-colors"
            >
              Khám phá khóa học
            </Link>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-lg">
                <stat.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.changeType === "increase"
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schedules fetched from API */}
        <div
          id="schedule"
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Lịch tập hôm nay
              </h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            {loadingSchedules ? (
              <div className="text-center text-gray-500 py-8">
                Đang tải lịch tập...
              </div>
            ) : schedules.filter((schedule) =>
                isTodayValidForCourse({
                  courseStartDate: schedule.courseStartDate,
                  courseEndDate: schedule.courseEndDate,
                  dayOfWeek: schedule.dayOfWeek,
                })
              ).length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Bạn chưa có lịch tập nào.
              </div>
            ) : (
              <div className="space-y-4">
                {schedules
                  .filter((schedule: ScheduleCourse) => {
                    // const today = new Date();
                    // function getWeekRange(date: Date): {
                    //   startOfWeek: Date;
                    //   endOfWeek: Date;
                    // } {
                    //   const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)

                    //   const startOfWeek = new Date(date);
                    //   startOfWeek.setDate(date.getDate() - day);
                    //   startOfWeek.setHours(0, 0, 0, 0);

                    //   const endOfWeek = new Date(date);
                    //   endOfWeek.setDate(date.getDate() + (6 - day));
                    //   endOfWeek.setHours(23, 59, 59, 999);

                    //   return { startOfWeek, endOfWeek };
                    // }

                    // const { startOfWeek, endOfWeek } = getWeekRange(today);

                    return isTodayValidForCourse({
                      courseStartDate: schedule.courseStartDate,
                      courseEndDate: schedule.courseEndDate,
                      dayOfWeek: schedule.dayOfWeek,
                    });
                  })
                  .slice(0, 3)
                  .map((schedule: ScheduleCourse) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Buổi tập</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Khóa tập: {schedule.courseName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Tên giáo viên: {schedule.teacherName}
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="mr-1">🕒</span>
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                            {schedule.dayOfWeek}
                          </span>
                          <div className="flex flex-col text-xs text-gray-500">
                            <div className="flex items-center pl-4">
                              {schedule.startTime} {" - "}
                              {schedule.endTime}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* You can add a join or details button here if needed */}
                    </div>
                  ))}
              </div>
            )}
            <button
              className="w-full mt-4 text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              onClick={() => router.push("/user/my-course?tab=calendar")}
            >
              Xem tất cả lịch tập →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Cuộc hẹn của tôi
              </h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            {loadingAppointments ? (
              <div className="text-center text-gray-500 py-8">
                Đang tải cuộc hẹn...
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Bạn chưa có cuộc hẹn nào.
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.appointmentId}
                    className="flex items-start space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg hover:bg-gradient-to-r hover:from-emerald-100 hover:to-blue-100 transition-colors"
                  >
                    <div className="p-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-lg">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {appointment.appointmentName}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {appointment.serviceName}
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-xs text-gray-500">
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleDateString("vi-VN")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {appointment.appointmentTime.substring(0, 5)}
                        </span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                          {appointment.price?.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/user/my-appointment">
              <button className="w-full mt-4 text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Xem tất cả cuộc hẹn →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Thao tác nhanh
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-lg transition-all group">
            <Calendar className="w-5 h-5 text-emerald-600 mr-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-emerald-700">Đặt lịch tập</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all group">
            <Target className="w-5 h-5 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-blue-700">Đặt mục tiêu</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg transition-all group">
            <TrendingUp className="w-5 h-5 text-orange-600 mr-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-orange-700">Xem báo cáo</span>
          </button>
        </div>
      </div>
      
      {/* Quick Action Buttons */}
      <QuickActionButtons />
    </div>
  );
}
