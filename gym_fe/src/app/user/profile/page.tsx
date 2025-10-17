'use client';

import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Edit3,
  Save,
  X,
  Lock,
  Bell,
  Shield,
  CreditCard,
  Target,
  Activity
} from 'lucide-react';
import AuthService from '@/service/authService';
import customerService from '@/service/customerService';
import { toast } from '@/hooks/use-toast';

const userProfile = {
  ...AuthService.getCurrentUser(),
  phone: AuthService.getCurrentUser()?.phone || '',
  address: AuthService.getCurrentUser()?.address || '',
  name: AuthService.getCurrentUser()?.name || 'Nguyễn Văn John',
  email: AuthService.getCurrentUser()?.email || 'john.doe@gmail.com',
  joinDate: AuthService.getCurrentUser()?.joinDate || '2023-08-10',
  membershipType: AuthService.getCurrentUser()?.membershipType || 'Premium',
  avatar: AuthService.getCurrentUser()?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  bio: AuthService.getCurrentUser()?.bio || 'Người đam mê fitness và yoga. Mục tiêu: sống khỏe mạnh và tích cực.',
  height: AuthService.getCurrentUser()?.height || '',
  weight: AuthService.getCurrentUser()?.weight || '',
  gender: AuthService.getCurrentUser()?.gender || '',
};

const fitnessGoals = [
  { id: 1, name: 'Giảm cân', target: '75kg', current: '80kg', progress: 60 },
  { id: 2, name: 'Tăng cơ', target: '15%', current: '12%', progress: 80 },
  { id: 3, name: 'Chạy bộ', target: '10km', current: '7km', progress: 70 },
];

const achievements = [
  { id: 1, name: '30 ngày liên tiếp', icon: '🔥', date: '2024-01-10' },
  { id: 2, name: 'Hoàn thành 50 buổi tập', icon: '💪', date: '2024-01-05' },
  { id: 3, name: 'Đạt mục tiêu tháng', icon: '🎯', date: '2023-12-31' },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState(userProfile);

  const handleSave = async () => {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('User not found');
      const updatePayload = {
        name: formData.name,
        email: formData.email, // Always include current email
        phoneNumber: formData.phone,
        address: formData.address,
        height: formData.height === '' ? null : Number(formData.height),
        weight: formData.weight === '' ? null : Number(formData.weight),
        gender: formData.gender,
        // Do not include password or bio
      };
      const updated = await customerService.update(user.userId || user.customerID, updatePayload);
      AuthService.setCurrentUser({ ...user, ...updated });
      toast({ title: 'Cập nhật thành công', description: 'Thông tin cá nhân đã được cập nhật.' });
      setIsEditing(false);
    } catch (err: any) {
      toast({ title: 'Cập nhật thất bại', description: err.message });
    }
  };

  const handleCancel = () => {
    setFormData(userProfile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{formData?.name?.[0] || 'U'}</span>
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-indigo-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{formData.name}</h1>
              <p className="text-indigo-100 text-lg mb-1">{formData.email}</p>
              <div className="flex items-center space-x-4 text-sm text-indigo-200">
                <span className="bg-indigo-700 px-3 py-1 rounded-full">
                  {formData.membershipType} Member
                </span>
                {/* <span>Tham gia từ {new Date(formData.joinDate).toLocaleDateString('vi-VN')}</span> */}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          >
            <Edit3 className="w-5 h-5 mr-2" />
            {isEditing ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'profile', name: 'Thông tin cá nhân', icon: User },
              { id: 'goals', name: 'Mục tiêu', icon: Target },
              { id: 'achievements', name: 'Thành tích', icon: Activity },
              { id: 'settings', name: 'Cài đặt', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6 text-black">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Họ và tên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500' : 'border-gray-200 bg-gray-50'
                        }`}
                    />
                  </div>
                </div>

                {/* Giới tính */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Giới tính
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className="text-black w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-300 bg-gray-50 focus:bg-white"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500' : 'border-gray-200 bg-gray-50'
                        }`}
                    />
                  </div>
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <div className="relative text-black">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black  w-5 h-5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500' : 'border-gray-200 bg-gray-50'
                        }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                      rows={1}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500' : 'border-gray-200 bg-gray-50'
                        }`}
                    />
                  </div>
                </div>

                {/* Chiều cao */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chiều cao (cm)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Nhập chiều cao"
                      className={`w-full pl-4 pr-4 py-3 rounded-lg border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500' : 'border-gray-200 bg-gray-50'}`}
                    />
                  </div>
                </div>

                {/* Cân nặng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cân nặng (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Nhập cân nặng"
                      className={`w-full pl-4 pr-4 py-3 rounded-lg border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500' : 'border-gray-200 bg-gray-50'}`}
                    />
                  </div>
                </div>            
              </div>
              {isEditing && (
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-600 transition-all flex items-center"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Mục tiêu fitness</h3>
                <button className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-600 transition-all">
                  Thêm mục tiêu
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fitnessGoals.map((goal) => (
                  <div key={goal.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h4 className="font-semibold text-gray-900 mb-3">{goal.name}</h4>
                    <div className="space-y-3 text-black">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hiện tại:</span>
                        <span className="font-medium">{goal.current}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Mục tiêu:</span>
                        <span className="font-medium">{goal.target}</span>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Tiến độ</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Thành tích đã đạt được</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Đạt được vào {new Date(achievement.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Cài đặt tài khoản</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Đổi mật khẩu</p>
                      <p className="text-sm text-gray-600">Cập nhật mật khẩu để bảo mật tài khoản</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Đổi
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Thông báo</p>
                      <p className="text-sm text-gray-600">Cài đặt thông báo email và push</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Cài đặt
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Phương thức thanh toán</p>
                      <p className="text-sm text-gray-600">Quản lý thẻ và ví điện tử</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Quản lý
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}