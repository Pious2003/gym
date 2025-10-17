"use client";

import {
  useEffect,
  useState,
} from 'react';

import {
  Bell,
  Calendar,
  CreditCard,
  Dumbbell,
  Home,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import {
  usePathname,
  useRouter,
} from 'next/navigation';

import ChatbotWidget from '@/component/ChatbotWidget';
import { cn } from '@/lib/utils';
import AuthService from '@/service/authService';

const navigation = [
  { name: "Trang chủ", href: "/user", icon: Home },
  { name: "Mua khóa tập", href: "/user/buy", icon: ShoppingCart },
  { name: "Khoá tập của tôi", href: "/user/my-course", icon: Calendar },
  { name: "Cuộc hẹn của tôi", href: "/user/my-appointment", icon: Calendar },
  { name: "Chatbot AI", href: "/user/chatbot-ai", icon: Calendar },
  { name: "Thanh toán", href: "/user/payments", icon: CreditCard },
  { name: "Hồ sơ", href: "/user/profile", icon: User },
];

// Lấy số lượng mặt hàng trong giỏ hàng từ localStorage giống trang giỏ hàng
const getCartCount = () => {
  if (typeof window !== "undefined") {
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    return Array.isArray(items)
      ? items.reduce((sum, item) => sum + (item.quantity || 0), 0)
      : 0;
  }
  return 0;
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const user = AuthService.getCurrentUser();
  const router = useRouter();

  const location = usePathname();

  const hasDefault = location === "/user";

  // State cho số lượng mặt hàng trong giỏ
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  // --- Hydration fix: only render user info after mount ---
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    // Lấy số lượng mặt hàng trong giỏ khi mount
    setCartCount(getCartCount());

    // Nếu muốn realtime, có thể lắng nghe storage event hoặc context
    const handleStorage = () => setCartCount(getCartCount());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {!hasDefault && <ChatbotWidget />}
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 bg-emerald-600">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-white font-bold text-lg">GymHub</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            {hasMounted && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.[0] || "User"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email || ""}</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation (scrollable) */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 transition-colors",
                        isActive
                          ? "text-emerald-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer (always at bottom) */}
          <div className="p-4 border-t border-gray-200 space-y-1">
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
              <Settings className="mr-3 h-4 w-4" />
              <span className="truncate">Cài đặt</span>
            </button>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              onClick={() => {
                AuthService.logout();
                router.push("/auth/login");
              }}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="truncate">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-8 container">
        <div>
          {/* Top bar */}
          <div className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              {/* Shopping cart icon with badge */}
              <Link
                href="/user/cart"
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[1.2rem] h-4 px-1 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">JD</span>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
