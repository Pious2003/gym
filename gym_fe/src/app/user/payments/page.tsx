"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Download,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import paymentService from "@/service/paymentService";
import { useUser } from "@/context/UserContext";

interface PaymentHistory {
  paymentId: string;
  courseId: string;
  courseName: string;
  instructor: string;
  amount: number;
  originalAmount: number;
  status: string;
  date: string;
  paymentMethod: string;
  transactionId: string;
  discount: number;
  paidAt: string;
}

export default function PaymentsPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!user?.userId) {
        setError("Không tìm thấy thông tin người dùng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const history = await paymentService.getPaymentHistory(user.userId);
        setTransactions(history);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Có lỗi xảy ra khi tải lịch sử giao dịch"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [user]);

  // Tính toán thống kê từ dữ liệu thực
  const paymentStats = [
    {
      name: "Tổng chi tiêu",
      value: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(transactions.reduce((sum, t) => sum + t.amount, 0)),
      change: "Từ tất cả giao dịch",
      changeType: "increase" as const,
      icon: DollarSign,
    },
    {
      name: "Giao dịch thành công",
      value: transactions
        .filter((t) => t.status === "completed")
        .length.toString(),
      change: "Giao dịch hoàn thành",
      changeType: "increase" as const,
      icon: CheckCircle,
    },
    {
      name: "Đang chờ xử lý",
      value: transactions
        .filter((t) => t.status === "pending")
        .length.toString(),
      change: "Chờ xác nhận",
      changeType: "neutral" as const,
      icon: AlertCircle,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Thành công";
      case "pending":
        return "Đang xử lý";
      case "failed":
        return "Thất bại";
      default:
        return status;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus =
      filterStatus === "all" || transaction.status === filterStatus;
    const matchesSearch =
      transaction.courseName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.instructor
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.paymentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Lịch sử thanh toán</h1>
        <p className="text-purple-100 text-lg">
          Theo dõi các giao dịch và quản lý hóa đơn của bạn
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paymentStats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <stat.icon className="w-6 h-6 text-purple-600" />
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm giao dịch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="completed">Thành công</option>
              <option value="pending">Đang xử lý</option>
              <option value="failed">Thất bại</option>
            </select>
            <button className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-600 transition-all flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.paymentId}
            className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow border border-purple-100 p-0 md:p-0 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left: Status bar */}
              <div className="w-full md:w-2 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none bg-gradient-to-b md:bg-gradient-to-r from-purple-400 to-purple-200" />
              {/* Main content */}
              <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
                {/* Info */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <h3 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-purple-400 mr-1" />
                      {transaction.courseName}
                    </h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border-2 border-dashed mt-2 sm:mt-0 ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1">
                        {getStatusText(transaction.status)}
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">Ngày thanh toán:</span>
                      <span className="font-medium">
                        {transaction.paidAt
                          ? new Date(transaction.paidAt).toLocaleString(
                              "vi-VN",
                              {
                                dateStyle: "short",
                                timeStyle: "short",
                              }
                            )
                          : "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">Phương thức:</span>
                      <span className="font-medium">{transaction.paymentMethod}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">Mã GD:</span>
                      <span className="font-mono">{transaction.transactionId}</span>
                    </div>
                  </div>
                </div>
                {/* Amount & Discount */}
                <div className="flex flex-col items-end min-w-[140px]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-purple-700">
                      {formatPrice(transaction.amount)}
                    </span>
                    {transaction.originalAmount > transaction.amount && (
                      <span className="text-base text-gray-400 line-through">
                        {formatPrice(transaction.originalAmount)}
                      </span>
                    )}
                  </div>
                  {transaction.discount > 0 && (
                    <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded mt-1">
                      Tiết kiệm {formatPrice(transaction.discount)}
                    </span>
                  )}
                </div>
                {/* Actions */}
                <div className="flex flex-row md:flex-col items-center gap-2 md:gap-3 min-w-[80px]">
                  <button
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Tải hóa đơn"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy giao dịch
            </h3>
            <p className="text-gray-600">
              Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
