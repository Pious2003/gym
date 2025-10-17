import React from 'react';

import {
  Calendar,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  Clock as ClockIcon,
  DollarSign,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';

interface DashboardProps {
  appointments: any[];
  customers: any[];
  services: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ appointments, customers, services }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.appointmentdate.split('T')[0] === today);
  const completedAppointments = appointments.filter(apt => apt.status);
  const totalRevenue = appointments
    .filter(apt => apt.status)
    .reduce((sum, apt) => sum + parseFloat(apt.price), 0);

  const stats = [
    {
      title: 'Cuộc Hẹn Hôm Nay',
      value: todayAppointments.length,
      icon: Calendar,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Tổng Khách Hàng',
      value: customers.filter(c => c.type === 1).length,
      icon: Users,
      color: 'green',
      change: '+5%'
    },
    {
      title: 'Doanh Thu',
      value: `${totalRevenue.toLocaleString('vi-VN')}đ`,
      icon: DollarSign,
      color: 'yellow',
      change: '+18%'
    },
    {
      title: 'Hoàn Thành',
      value: completedAppointments.length,
      icon: CheckCircle,
      color: 'emerald',
      change: '+22%'
    }
  ];

  const colorClasses: any = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    emerald: 'bg-emerald-500'
  };

  const recentAppointments = appointments
    .sort((a, b) => new Date(b.appointmentdate).getTime() - new Date(a.appointmentdate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Cuộc Hẹn Gần Đây</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentAppointments.map((appointment) => {
                const customer = customers.find(c => c.customerID === appointment.customerid || c.customerid === appointment.customerid);
                const service = services.find(s => s.serviceID === appointment.serviceid || s.serviceid === appointment.serviceid);
                // Format date as dd/MM/yyyy
                const dateStr = appointment.appointmentdate ? new Date(appointment.appointmentdate).toLocaleDateString('vi-VN') : '';
                // Format time as HH:mm
                let timeStr = '';
                if (appointment.appointmenttime) {
                  if (typeof appointment.appointmenttime === 'string') {
                    timeStr = appointment.appointmenttime.slice(0, 5);
                  } else if (typeof appointment.appointmenttime === 'object' && appointment.appointmenttime.hours !== undefined) {
                    timeStr = `${appointment.appointmenttime.hours.toString().padStart(2, '0')}:${appointment.appointmenttime.minutes.toString().padStart(2, '0')}`;
                  }
                }
                return (
                  <div key={appointment.appointmentid} className="bg-white rounded-2xl shadow border border-gray-100 hover:shadow-lg transition-all p-6 mb-4 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full ${appointment.status ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <h4 className="font-semibold text-gray-900 text-base">{appointment.appointmentname}</h4>
                    </div>
                    <div className="flex flex-col gap-3 pl-6">
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{customer?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                        <span>{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <ClockIcon className="w-4 h-4 text-gray-500" />
                        <span>{timeStr}</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 my-3"></div>
                    <div className="pl-6 italic text-gray-500 text-sm">{service?.serviceName || 'N/A'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Lịch Hôm Nay</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment) => {
                  const customer = customers.find(c => c.customerid === appointment.customerid);

                  return (
                    <div key={appointment.appointmentid} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{appointment.appointmenttime}</p>
                        <p className="text-xs text-gray-600">{customer?.customername}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">Không có cuộc hẹn nào hôm nay</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;