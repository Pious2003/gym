"use client";

import React, { useState } from 'react';

import {
  Check,
  Clock,
  Filter,
  Heart,
  Info,
  Plus,
  Search,
  ShoppingCart,
  Users,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import QuickActionButtons from '@/component/QuickActionButtons';
import { CourseModal } from '@/component/workout/CourseModal';
import { API_BASE } from '@/lib/utils';

import { useUser } from '../context/UserContext';
import { fetchAllServices } from '../service/serviceService';
import { fetchWorkoutCourses } from '../service/workOutCourse';
import { Service } from '../type/service';

// Toast helper
function showToast(message: string) {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.className =
    "fixed top-6 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] text-base font-semibold animate-fade-in";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("animate-fade-out");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 400);
  }, 1800);
}

if (
  typeof window !== "undefined" &&
  !document.getElementById("custom-toast-style")
) {
  const style = document.createElement("style");
  style.id = "custom-toast-style";
  style.innerHTML = `
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px);} to { opacity: 1; transform: translateY(0);} }
    @keyframes fadeOut { from { opacity: 1;} to { opacity: 0; } }
    .animate-fade-in { animation: fadeIn 0.3s ease; }
    .animate-fade-out { animation: fadeOut 0.4s ease; }
  `;
  document.head.appendChild(style);
}

async function fetchRecommendations(height: number, weight: number) {
  const res = await fetch(`${API_BASE}/api/recommendation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ height, weight }),
  });
  if (!res.ok) return [];
  return await res.json(); // array of courseid
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [courses, setCourses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tất cả"]);
  const [showAll, setShowAll] = useState(false);

  const handleViewDetails = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };
  const router = useRouter();
  // Thêm state cho user
  const { user } = useUser();
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);

  React.useEffect(() => {
    fetchWorkoutCourses()
      .then(setCourses)
      .finally(() => setLoading(false));
    fetchAllServices().then((services: Service[]) => {
      setServices(services);
      const names = services.map((s) => s.serviceName).filter(Boolean);
      setCategories(["Tất cả", ...Array.from(new Set(names))]);
    });
  }, []);

  React.useEffect(() => {
    if (user && user.height && user.weight) {
      fetchRecommendations(user.height, user.weight).then(setRecommendedIds);
    }
  }, [user]);

  // Find the selected serviceID based on selectedCategory
  const selectedService = services.find(
    (s) => s.serviceName === selectedCategory
  );
  const selectedServiceID = selectedService?.serviceID;

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === "Tất cả" || course.serviceid === selectedServiceID;
    const matchesSearch =
      (course.coursename || course.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (course.personaltrainername || course.instructor || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Gợi ý khoá học dựa vào BMI
  // let recommendedIds: string[] = []; // This line is removed as recommendedIds is now fetched from backend

  // Sort: khoá gợi ý lên đầu
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const aRec = recommendedIds.includes(a.courseid || a.id);
    const bRec = recommendedIds.includes(b.courseid || b.id);
    if (aRec && !bRec) return -1;
    if (!aRec && bRec) return 1;
    return 0;
  });

  // Display logic: show 8 courses (2 rows) initially, or all if showAll is true
  const coursesToShow = showAll ? sortedCourses : sortedCourses.slice(0, 8);
  const hasMoreCourses = sortedCourses.length > 8;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Hàm xử lý thêm vào giỏ hàng và toast
  const handleAddToCart = (course: any) => {
    // Check if user is logged in
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const idx = cartItems.findIndex(
      (item: any) => item.id === (course.courseid || course.id)
    );
    const service = services.find((s) => s.serviceID === course.serviceid);
    const servicePrice = service?.servicePrice || 0;

    if (idx === -1) {
      cartItems.push({
        ...course,
        id: course.courseid || course.id,
        quantity: 1,
        servicePrice,
        serviceName: service?.serviceName || "",
      });
    } else {
      cartItems[idx].quantity += 1;
      cartItems[idx].servicePrice = servicePrice;
      cartItems[idx].serviceName = service?.serviceName || "";
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.dispatchEvent(new StorageEvent("storage", { key: "cartItems" }));
    showToast("Thêm khoá tập vào giỏ thành công");
    return true;
  };

  // Hàm xử lý khi nhấn "Mua ngay" - luôn thêm vào giỏ và chuyển trang cart ngay lập tức
  const handleBuyNow = (course: any) => {
    // Check if user is logged in
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const idx = cartItems.findIndex(
      (item: any) => item.id === (course.courseid || course.id)
    );
    const service = services.find((s) => s.serviceID === course.serviceid);
    const servicePrice = service?.servicePrice || 0;
    if (idx === -1) {
      cartItems.push({
        ...course,
        id: course.courseid || course.id,
        quantity: 1,
        servicePrice,
        serviceName: service?.serviceName || "",
      });
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      window.dispatchEvent(new StorageEvent("storage", { key: "cartItems" }));
    }
    router.push("/user/cart");
  };

  return (
    <div className="space-y-6 max-w-full mt-5 mx-4 md:mx-8 lg:mx-12 xl:mx-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Khám phá khóa tập</h1>
        <p className="text-emerald-100 text-lg">
          Tìm kiếm khóa tập phù hợp với mục tiêu và trình độ của bạn
        </p>
      </div>

      {/* Login prompt for non-authenticated users */}
      {!user && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-amber-800 font-medium">
                  Đăng nhập để mua khóa tập
                </p>
                <p className="text-amber-600 text-sm">
                  Bạn có thể xem các khóa tập, nhưng cần đăng nhập để thêm vào giỏ hàng hoặc mua ngay.
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa tập..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="popular">Phổ biến</option>
              <option value="rating">Đánh giá cao</option>
              <option value="price-low">Giá thấp</option>
              <option value="price-high">Giá cao</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-96 text-xl">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {coursesToShow.map((course: any) => {
            const service = services.find(
              (s) => s.serviceID === course.serviceid
            );
            const isRecommended = recommendedIds.includes(
              course.courseid || course.id
            );
            return (
              <div
                key={course.courseid || course.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col"
              >
                <div className="relative bg-gray-200">
                  <img
                    src={course.imageurl || course.imageUrl || course.image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop&auto=format'}
                    alt={course.coursename || course.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('fallback')) {
                        target.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop&auto=format&fallback=true';
                      }
                    }}
                    loading="lazy"
                  />
                  {isRecommended && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-green-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white">
                      Gợi ý
                    </div>
                  )}
                  {course.popular && (
                    <div
                      className="absolute top-4 left-4 bg-gradient-to-r from-orange-400 to-pink-400 text-white px-3 py-1 rounded-full text-xs font-medium"
                      style={{ top: isRecommended ? "2.5rem" : "1rem" }}
                    >
                      Phổ biến
                    </div>
                  )}
                  <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded">
                      {course.level || "Cơ bản"}
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 ml-1">
                        {course.rating || ""}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        {course.reviews ? `(${course.reviews})` : ""}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {course.coursename || course.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.durationweek ||
                        course.durationWeek ||
                        course.duration ||
                        ""}{" "}
                      tuần
                    </div>
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      {course.sessions || ""} buổi
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.students || ""}
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {(course.highlights || [])
                      .slice(0, 2)
                      .map((highlight: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <Check className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                          {highlight}
                        </div>
                      ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPrice(course.price)}
                        </span>
                      </div>
                      {service && (
                        <div className="mt-2 mb-1 space-y-1 text-xs text-gray-600">
                          <div className="flex items-center">
                            <span className="font-semibold">Dịch vụ:</span>
                            <span className="ml-1">{service.serviceName}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold">Giá dịch vụ:</span>
                            <span className="ml-1">
                              {service.servicePrice.toLocaleString()}₫
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <span className="font-semibold">Huấn luyện viên:</span>
                        <span className="ml-1">
                          {course.personaltrainername || course.instructor}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleViewDetails(course)}
                    className="mb-4 max-w-fit px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    Chi tiết
                  </div>

                  <div className="flex space-x-2">
                    <button
                      className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group ${user
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600"
                        : "bg-gray-400 text-white cursor-not-allowed"
                        }`}
                      onClick={() => handleBuyNow(course)}
                      disabled={!user}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      {user ? "Mua ngay" : "Đăng nhập để mua"}
                    </button>
                    <button
                      className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group ${user
                        ? "bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                        : "bg-gray-100 border border-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      onClick={() => handleAddToCart(course)}
                      disabled={!user}
                    >
                      <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      {user ? "Thêm vào giỏ" : "Đăng nhập để thêm"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Show More Button */}
      {!loading && hasMoreCourses && !showAll && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span>Xem thêm khóa tập</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Show Less Button */}
      {!loading && showAll && hasMoreCourses && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(false)}
            className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-8 py-3 rounded-lg font-medium hover:from-gray-700 hover:to-gray-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span>Thu gọn</span>
            <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy khóa tập
          </h3>
          <p className="text-gray-600">
            Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc.
          </p>
        </div>
      )}
      {selectedCourse && (
        <CourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          course={selectedCourse}
        />
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded-2xl mt-12">
        <div className="px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-emerald-100">GYM FITNESS</h3>
              <p className="text-gray-300 mb-4">
                Trung tâm thể dục thể thao hàng đầu với đội ngũ huấn luyện viên chuyên nghiệp và trang thiết bị hiện đại.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">ig</span>
                </div>
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">yt</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-100">Liên kết nhanh</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Trang chủ</a></li>
                <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Khóa tập</a></li>
                <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Huấn luyện viên</a></li>
                <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Liên hệ</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-100">Dịch vụ</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-300">Yoga & Pilates</span></li>
                <li><span className="text-gray-300">Strength Training</span></li>
                <li><span className="text-gray-300">Cardio & HIIT</span></li>
                <li><span className="text-gray-300">CrossFit</span></li>
                <li><span className="text-gray-300">Personal Training</span></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-100">Liên hệ</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs">📍</span>
                  </div>
                  <span className="text-gray-300 text-sm">123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-xs">📞</span>
                  </div>
                  <span className="text-gray-300 text-sm">0123 456 789</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-xs">✉️</span>
                  </div>
                  <span className="text-gray-300 text-sm">info@gymfitness.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-xs">🕒</span>
                  </div>
                  <span className="text-gray-300 text-sm">6:00 - 22:00 (Hàng ngày)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-emerald-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 GYM FITNESS. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Chính sách bảo mật</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Điều khoản sử dụng</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Hỗ trợ</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Quick Action Buttons */}
      <QuickActionButtons />
    </div>
  );
}