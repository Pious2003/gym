'use client';
import React, {
  useEffect,
  useState,
} from 'react';

import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  Edit2,
  Eye,
  FileText,
  Filter,
  MoreVertical,
  Package,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from 'lucide-react';

import serviceService from '../../../service/serviceService';
import {
  Service,
  ServiceFormData,
} from '../../../type/service';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  visible: boolean;
}

const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add' | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [formData, setFormData] = useState<ServiceFormData>({
    serviceName: '',
    courseDescription: '',
    servicePrice: 0
  });

  const fetchServices = async () => {
    try {
      const params = {
        keyword: searchTerm.trim(),
        minPrice,
        maxPrice,
        page: currentPage,
        pageSize
      };
      const res = await serviceService.getPaged(params);
      setServices(res.items);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching services:', err);
      showNotification('error', 'Không thể tải danh sách dịch vụ');
    }
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, minPrice, maxPrice, currentPage, pageSize]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.serviceName.trim()) {
      showNotification('error', 'Vui lòng nhập tên dịch vụ');
      return;
    }

    if (!formData.courseDescription.trim()) {
      showNotification('error', 'Vui lòng nhập mô tả dịch vụ');
      return;
    }

    if (formData.servicePrice <= 0) {
      showNotification('error', 'Giá dịch vụ phải lớn hơn 0');
      return;
    }

    setIsLoading(true);

    try {
      if (modalMode === 'edit' && selectedService) {
        await serviceService.update(selectedService.serviceID, formData);
        showNotification('success', 'Cập nhật dịch vụ thành công!');
      } else {
        await serviceService.create(formData);
        showNotification('success', 'Thêm dịch vụ thành công!');
      }

      fetchServices();
      handleCloseModal();
    } catch (err) {
      showNotification('error', 'Có lỗi xảy ra khi lưu dữ liệu');
      console.error('Submit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      return;
    }

    try {
      await serviceService.delete(id);
      fetchServices();
      showNotification('success', 'Xóa dịch vụ thành công!');
    } catch (err) {
      showNotification('error', 'Có lỗi xảy ra khi xóa dịch vụ');
      console.error('Delete failed:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'servicePrice' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowViewModal(false);
    setFormData({
      serviceName: '',
      courseDescription: '',
      servicePrice: 0
    });
    setSelectedService(null);
    setModalMode(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPriceColor = (price: number) => {
    if (price >= 200000) return 'bg-red-100 text-red-800';
    if (price >= 150000) return 'bg-orange-100 text-orange-800';
    if (price >= 100000) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    const id = Date.now().toString();
    const notification: ToastNotification = { id, type, message, visible: true };

    setNotifications(prev => [...prev, notification]);

    setTimeout(() => {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, visible: false } : n)
      );

      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 300);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`transform transition-all duration-300 ease-in-out ${notification.visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
          >
            <div className={`flex items-center p-4 rounded-lg shadow-lg min-w-80 ${notification.type === 'success'
                ? 'bg-green-50 border-l-4 border-green-400'
                : notification.type === 'error'
                  ? 'bg-red-50 border-l-4 border-red-400'
                  : 'bg-yellow-50 border-l-4 border-yellow-400'
              }`}>
              {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-400 mr-3" />}
              {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-red-400 mr-3" />}
              {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />}
              <span className={`text-sm font-medium ${notification.type === 'success'
                  ? 'text-green-800'
                  : notification.type === 'error'
                    ? 'text-red-800'
                    : 'text-yellow-800'
                }`}>
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
            <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
          </div>
          <button
            onClick={() => {
              setShowAddModal(true);
              setModalMode('add');
            }}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Thêm dịch vụ</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng dịch vụ</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm dịch vụ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-gray-900 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Giá từ"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="text-gray-900 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-32"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Giá đến"
                  value={maxPrice || ''}
                  onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="text-gray-900 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-32"
                />
              </div>
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

        {/* Services Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên dịch vụ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá dịch vụ
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg font-medium">Không tìm thấy dịch vụ nào</p>
                      <p className="text-sm">Hãy thêm dịch vụ mới để bắt đầu</p>
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service.serviceID} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{service.serviceName}</div>
                            <div className="text-sm text-gray-500">ID: {service.serviceID}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-2">
                          <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {service.courseDescription.length > 80
                              ? `${service.courseDescription.substring(0, 80)}...`
                              : service.courseDescription}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriceColor(service.servicePrice)}`}>
                          {formatPrice(service.servicePrice)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedService(service);
                              setShowViewModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedService(service);
                              setFormData({
                                serviceName: service.serviceName,
                                courseDescription: service.courseDescription,
                                servicePrice: service.servicePrice,
                              });
                              setModalMode('edit');
                              setShowAddModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 transition-colors p-2 hover:bg-green-50 rounded-lg"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(service.serviceID)}
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
              Trang <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-gray-900 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="5">5 / trang</option>
                <option value="10">10 / trang</option>
                <option value="20">20 / trang</option>
              </select>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                    className={`px-3 py-2 rounded-md transition-colors ${pageNum === currentPage
                        ? 'bg-green-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                ) : null;
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Service Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {modalMode === 'edit' ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
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
                  {/* Service Name */}
                  <div>
                    <label htmlFor="serviceName" className="block text-sm font-semibold text-gray-700 mb-3">
                      Tên dịch vụ
                    </label>
                    <div className="relative">
                      <Tag className="h-5 w-5 text-green-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        id="serviceName"
                        name="serviceName"
                        value={formData.serviceName}
                        onChange={handleInputChange}
                        maxLength={50}
                        required
                        className="text-gray-900 w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Nhập tên dịch vụ..."
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.serviceName.length}/50 ký tự
                    </p>
                  </div>

                  {/* Course Description */}
                  <div>
                    <label htmlFor="courseDescription" className="block text-sm font-semibold text-gray-700 mb-3">
                      Mô tả dịch vụ
                    </label>
                    <div className="relative">
                      <FileText className="h-5 w-5 text-blue-400 absolute left-3 top-3" />
                      <textarea
                        id="courseDescription"
                        name="courseDescription"
                        value={formData.courseDescription}
                        onChange={handleInputChange}
                        maxLength={250}
                        rows={4}
                        required
                        className="text-gray-900 w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                        placeholder="Nhập mô tả chi tiết về dịch vụ..."
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.courseDescription.length}/250 ký tự
                    </p>
                  </div>

                  {/* Service Price */}
                  <div>
                    <label htmlFor="servicePrice" className="block text-sm font-semibold text-gray-700 mb-3">
                      Giá dịch vụ (VND)
                    </label>
                    <div className="relative">
                      <DollarSign className="h-5 w-5 text-purple-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="number"
                        id="servicePrice"
                        name="servicePrice"
                        value={formData.servicePrice}
                        onChange={handleInputChange}
                        min="0"
                        step="1000"
                        required
                        className="text-gray-900 w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Nhập giá dịch vụ..."
                      />
                    </div>
                    {formData.servicePrice > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Giá hiển thị: {formatPrice(formData.servicePrice)}
                      </p>
                    )}
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
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Đang lưu...' : modalMode === 'edit' ? 'Lưu thay đổi' : 'Thêm dịch vụ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Service Modal */}
        {showViewModal && selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Chi tiết dịch vụ</h2>
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
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">ID dịch vụ</label>
                    <p className="mt-1 text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg">
                      {selectedService.serviceID}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">Tên dịch vụ</label>
                    <p className="mt-1 text-gray-900 font-medium text-lg">
                      {selectedService.serviceName}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">Mô tả dịch vụ</label>
                    <p className="mt-1 text-gray-900 leading-relaxed">
                      {selectedService.courseDescription}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">Giá dịch vụ</label>
                    <div className="mt-1">
                      <span className={`inline-flex px-4 py-2 text-lg font-semibold rounded-full ${getPriceColor(selectedService.servicePrice)}`}>
                        {formatPrice(selectedService.servicePrice)}
                      </span>
                    </div>
                  </div>

                  {selectedService.createdAt && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Ngày tạo</label>
                      <p className="mt-1 text-gray-900">
                        {new Date(selectedService.createdAt).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;