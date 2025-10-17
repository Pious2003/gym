'use client';
import React, {
  useEffect,
  useState,
} from 'react';

import {
  Bell,
  Calendar,
  CardSim,
  Home,
  LogOut,
  Menu,
  Package,
  Projector,
  Search,
  Settings,
  Users,
  Wallpaper,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import AuthService from '@/service/authService';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Navigation for regular admin users
const regularAdminNavigation = [
  { name: 'Báo cáo', href: '/admin/dashboard', icon: Home },
  { name: 'Quản lý người dùng', href: '/admin/user', icon: Users },
  { name: 'Quản lý lịch trình', href: '/admin/schedule', icon: Wallpaper },
  { name: 'Quản lý dịch vụ', href: '/admin/service', icon: CardSim },
  { name: 'Quản lý Các gói tập', href: '/admin/workout', icon: Package },
  { name: 'Quản lý Các cuộc hẹn', href: '/admin/appointment', icon: Projector },
  { name: 'Cài Đặt', href: '/admin/settings', icon: Settings },
];

// Navigation for PT users (type === 2)
const ptAdminNavigation = [
  { name: 'Khóa học của tôi', href: '/admin/pt-courses', icon: Calendar },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  // Determine navigation based on user type
  const navigation = user?.type === 2 ? ptAdminNavigation : regularAdminNavigation;
  const isPTUser = user?.type === 2;

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600">
          <h1 className="text-xl font-bold text-white">
            {isPTUser ? 'PT Panel' : 'Admin Panel'}
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-2 transition-colors duration-200 ${isActive
                  ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            onClick={() => {
              AuthService.logout();
              window.location.href = '/auth/login';
            }}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="lg:ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex w-full justify-between items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 min-w-[400px] pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className='flex items-center gap-5'>
                <button className="relative text-gray-400 hover:text-gray-500">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                    3
                  </span>
                </button>

                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{user?.name?.[0] || 'A'}</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-700">
                      {user?.name || 'Admin User'}
                      {isPTUser && <span className="ml-2 text-xs text-blue-600 font-medium">(PT)</span>}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
