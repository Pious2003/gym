import React, { useState, useEffect } from 'react';

import {
  Calendar,
  Clock,
  Edit,
  Search,
  Trash2,
  User,
} from 'lucide-react';

interface AppointmentListProps {
  appointments: any[];
  customers: any[];
  services: any[];
  onEditAppointment: (appointment: any) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

import StatusService, { AppointmentStatus } from '../../service/statusService';

const statusColorMap: Record<string, string> = {
  'Đã xác nhận': 'bg-green-100 text-green-800',
  'Đã hoàn thành': 'bg-yellow-100 text-yellow-800',
  'Đã huỷ': 'bg-red-100 text-red-700',
};

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  customers,
  services,
  onEditAppointment,
  onDeleteAppointment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
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

  const filteredAppointments = appointments.filter(appointment => {
    const customer = customers.find(c => c.customerid === appointment.customerid);
    const service = services.find(s => s.serviceid === appointment.serviceid);

    const matchesSearch =
      appointment.appointmentname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.customername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service?.servicename.toLowerCase().includes(searchTerm.toLowerCase());

    const statusName = statuses.find((status) => status.statusid === appointment.statusid)?.statusname;

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === statusName);

    const today = new Date().toISOString();
    const appointmentDate = appointment.appointmentdate;

    const matchesDate = dateFilter === 'all' ||
      (dateFilter === 'today' && appointmentDate === today) ||
      (dateFilter === 'upcoming' && appointmentDate > today) ||
      (dateFilter === 'past' && appointmentDate < today);

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm cuộc hẹn, khách hàng, dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loadingStatuses}
            >
              <option value="all">Tất cả trạng thái</option>
              {statuses.map((status) => (
                <option key={status.statusid} value={status.statusname}>
                  {status.statusname}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="upcoming">Sắp tới</option>
              <option value="past">Đã qua</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Hiển thị {filteredAppointments.length} trong tổng số {appointments.length} cuộc hẹn
        </p>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAppointments.map((appointment) => {
          const customer = customers.find(c => c.customerID === appointment.customerid);
          const service = services.find(s => s.serviceID === appointment.serviceid);

          return (
            <div key={appointment.appointmentid} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{appointment.appointmentname}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      statusColorMap[statuses.find((status) => status.statusid === appointment.statusid)?.statusname!] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {statuses.find((status) => status.statusid === appointment.statusid)?.statusname || appointment.statusid}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{customer?.name || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {appointment.appointmentdate
                        ? new Date(appointment.appointmentdate).toISOString().split('T')[0]
                        : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{appointment.appointmenttime}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">{service?.serviceName || 'N/A'}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditAppointment(appointment)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => onDeleteAppointment(appointment.appointmentid)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy cuộc hẹn nào</h3>
          <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;