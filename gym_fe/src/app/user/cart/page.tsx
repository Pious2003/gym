"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Trash2,
  User,
  Clock,
  Zap,
  Briefcase,
  BookCheck,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import AuthService from "@/service/authService";
import PaymentService from "@/service/paymentService";

const stripePromise = loadStripe("");

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  // Optional fields for display
  image?: string;
  imageUrl?: string;
  imageurl?: string;
  coursename?: string;
  description?: string;
  personaltrainername?: string;
  instructor?: string;
  durationweek?: number;
  durationWeek?: number;
  duration?: number;
  sessions?: number;
  servicePrice: number;
  serviceName: string;
}

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "₫";
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "true") {
      // Gọi API lưu payment và payment_detail
      const user = AuthService.getCurrentUser();
      const customerId = user?.userId || user?.customerID;
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

      const items = cartItems.map((item: CartItem) => ({
        ...item,
        price: item.price + item.servicePrice,
      }));

      if (items.length > 0 && customerId) {
        PaymentService.savePayment({
          Items: items,
          CustomerId: customerId,
        }).catch((error) => {
          console.error("Failed to save payment:", error);
        });
      }
      localStorage.removeItem("cartItems");
      setCartItems([]);
      window.dispatchEvent(new StorageEvent("storage", { key: "cartItems" }));
    } else {
      const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartItems(items);
    }
  }, [success]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity + item.servicePrice * item.quantity,
    0
  );

  const handleRemove = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent("storage", { key: "cartItems" }));
  };

  const handleQuantityChange = (id: string, delta: number) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent("storage", { key: "cartItems" }));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    const user = AuthService.getCurrentUser();
    const customerId = user?.userId || user?.customerID;

    try {
      const data = await PaymentService.createCheckoutSession({
        Items: cartItems.map((item) => ({
          Name: item.coursename || item.name,
          Price: item.price + item.servicePrice,
        })),
        Origin: window.location.origin,
        CustomerId: customerId,
      });

      const stripe = await stripePromise;
      if (stripe && data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-8 h-8 text-emerald-600" />
        <h1 className="text-3xl font-extrabold text-gray-900">
          Giỏ hàng của bạn
        </h1>
      </div>
      {success === "true" && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-100 text-emerald-800 text-center font-semibold text-lg shadow">
          Thanh toán thành công! Cảm ơn bạn đã mua khoá tập tại GymHub.
        </div>
      )}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow">
          <ShoppingCart className="w-16 h-16 text-gray-200 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-500">
            Hãy thêm các khóa tập để bắt đầu hành trình luyện tập!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6">
          <ul className="divide-y divide-gray-100 mb-8">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-col md:flex-row md:items-center py-6 gap-5"
              >
                <div className="flex-shrink-0">
                  <img
                    src={
                      item.imageurl ||
                      item.imageUrl ||
                      item.image ||
                      "https://placehold.co/96x96?text=No+Image"
                    }
                    alt={item.coursename || item.name}
                    className="w-24 h-24 object-cover rounded-lg border bg-gray-100"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.coursename || item.name}
                    </h3>
                    <button
                      className="p-2 rounded-full hover:bg-red-50 transition"
                      title="Xóa khỏi giỏ"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-1 line-clamp-2 truncate">
                      {item.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                    {(item.personaltrainername || item.instructor) && (
                      <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                        <User className="w-4 h-4" />
                        {item.personaltrainername || item.instructor}
                      </span>
                    )}
                    {(item.durationweek ||
                      item.durationWeek ||
                      item.duration) && (
                      <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                        <Clock className="w-4 h-4" />
                        {item.durationweek ||
                          item.durationWeek ||
                          item.duration}{" "}
                        tuần
                      </span>
                    )}
                    {item.sessions && (
                      <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                        <Zap className="w-4 h-4" />
                        {item.sessions} buổi
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 my-2">
                    <BookCheck className="w-4 h-4 text-gray-400" />
                    <span className="font-normal text-xs text-gray-400">Dịch vụ:</span>
                    <span className="font-semibold text-emerald-600">{item.serviceName}</span>
                    <span className="ml-2 text-gray-400">
                      {formatPrice(item.servicePrice || 0)}
                    </span>
                  </span>
                  <div className="flex items-center gap-4 mt-2">
                    {/* <span className="px-3 font-semibold text-gray-900">
                      Giá tiền:
                    </span> */}
                    <span className="text-emerald-600 font-bold text-2xl">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t pt-6">
            <span className="text-lg font-semibold text-gray-700">
              Tổng cộng:
            </span>
            <span className="text-2xl font-extrabold text-emerald-600">
              {formatPrice(total)}
            </span>
          </div>
          <button
            className="mt-8 w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center gap-2"
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
          >
            <ShoppingCart className="w-6 h-6" />
            Thanh toán với Stripe
          </button>
        </div>
      )}
    </div>
  );
}
