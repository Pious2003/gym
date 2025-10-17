'use client';
import React, {
  useEffect,
  useState,
} from 'react';

import {
  Activity,
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react';

import dashboardService, {
  AppointmentTrend,
  DashboardOverview,
  PopularService,
  RecentActivity,
  RevenueChartData,
} from '../../../service/dashboardService';

export default function AdminDashboard() {
    const [overview, setOverview] = useState<DashboardOverview | null>(null);
    const [revenueData, setRevenueData] = useState<RevenueChartData[]>([]);
    const [appointmentTrends, setAppointmentTrends] = useState<AppointmentTrend[]>([]);
    const [popularServices, setPopularServices] = useState<PopularService[]>([]);
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chartPeriod, setChartPeriod] = useState<'month' | 'week'>('month');

    useEffect(() => {
        fetchDashboardData();
    }, [chartPeriod]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [
                overviewData,
                revenueData,
                appointmentTrendsData,
                popularServicesData,
                recentActivitiesData
            ] = await Promise.all([
                dashboardService.getOverview(),
                dashboardService.getRevenueChart(chartPeriod),
                dashboardService.getAppointmentTrends(),
                dashboardService.getPopularServices(),
                dashboardService.getRecentActivities()
            ]);

            setOverview(overviewData);
            setRevenueData(revenueData);
            setAppointmentTrends(appointmentTrendsData);
            setPopularServices(popularServicesData);
            setRecentActivities(recentActivitiesData);
        } catch (err) {
            setError('Không thể tải dữ liệu dashboard');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'new':
                return <UserPlus className="w-4 h-4 text-blue-500" />;
            default:
                return <Activity className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-50';
            case 'pending':
                return 'text-yellow-600 bg-yellow-50';
            case 'new':
                return 'text-blue-600 bg-blue-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Tổng quan hệ thống quản lý phòng gym</p>
                </div>

                {/* Overview Cards */}
                {overview && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Tổng Khách Hàng</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{overview.totalCustomers}</p>
                                    <div className="flex items-center mt-2">
                                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                        <span className="text-sm text-green-600">{overview.customerGrowth}</span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Doanh Thu Tháng</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {overview.monthlyRevenue.toLocaleString('vi-VN')}đ
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                        <span className="text-sm text-green-600">{overview.revenueChange}</span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Cuộc Hẹn Hôm Nay</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{overview.todayAppointments}</p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-sm text-gray-600">
                                            {overview.completedToday}/{overview.totalToday} hoàn thành
                                        </span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Khóa Học Đang Chạy</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{overview.activeCourses}</p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-sm text-gray-600">
                                            {overview.enrolledStudents} học viên
                                        </span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <BookOpen className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Revenue Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Doanh Thu</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setChartPeriod('week')}
                                    className={`px-3 py-1 text-sm rounded-lg ${chartPeriod === 'week'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Tuần
                                </button>
                                <button
                                    onClick={() => setChartPeriod('month')}
                                    className={`px-3 py-1 text-sm rounded-lg ${chartPeriod === 'month'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Tháng
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {revenueData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">{item.period}</span>
                                    <span className="text-sm font-semibold text-green-600">
                                        {item.revenue.toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Popular Services */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Dịch Vụ Phổ Biến</h3>
                        <div className="space-y-4">
                            {popularServices.map((service, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{service.serviceName}</p>
                                        <p className="text-xs text-gray-500">{service.bookingCount} lượt đặt</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-green-600">
                                            {service.revenue.toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Hoạt Động Gần Đây</h3>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0 mt-1">
                                    {getStatusIcon(activity.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                    <p className="text-sm text-gray-500">{activity.description}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(activity.date).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                    {activity.status === 'completed' && 'Hoàn thành'}
                                    {activity.status === 'pending' && 'Đang xử lý'}
                                    {activity.status === 'new' && 'Mới'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 