using gym_be.Models;
using gym_be.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace gym_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly GymContext _context;

        public DashboardController(GymContext context)
        {
            _context = context;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            try
            {
                var today = DateTime.UtcNow.Date;
                var startOfMonth = new DateTime(today.Year, today.Month, 1, 0, 0, 0, DateTimeKind.Utc);
                var startOfLastMonth = startOfMonth.AddMonths(-1);

                // Total customers (only regular users, type 1)
                var totalCustomers = await _context.Customers
                    .Where(c => c.Type == 1) // Only regular users, not admins or PTs
                    .CountAsync();

                // Get completed status ID (assuming it exists in status table)
                var completedStatusId = await _context.Status
                    .Where(s => s.statusname.ToLower().Contains("completed") || s.statusname.ToLower().Contains("hoàn thành"))
                    .Select(s => s.statusid)
                    .FirstOrDefaultAsync();

                // Today's appointments (UTC)
                var todayAppointments = await _context.Appointments
                    .Where(a => a.appointmentdate.Date == today)
                    .CountAsync();

                var completedToday = await _context.Appointments
                    .Where(a => a.appointmentdate.Date == today && a.statusid == completedStatusId)
                    .CountAsync();

                // Monthly revenue
                var monthlyRevenue = await _context.Payments
                    .Where(p => p.PaidAt >= startOfMonth)
                    .SumAsync(p => p.Amount);

                var lastMonthRevenue = await _context.Payments
                    .Where(p => p.PaidAt >= startOfLastMonth && p.PaidAt < startOfMonth)
                    .SumAsync(p => p.Amount);

                var revenueChange = lastMonthRevenue > 0 
                    ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100).ToString("F1")
                    : "0";

                // Active courses
                var activeCourses = await _context.WorkoutCourses.CountAsync();

                // Total enrolled students (only regular users, type 1)
                var enrolledStudents = await _context.Customers
                    .Where(c => c.Type == 1 && c.Status == 1) // Only active regular users
                    .CountAsync();

                var result = new
                {
                    totalCustomers,
                    todayAppointments,
                    completedToday,
                    totalToday = todayAppointments,
                    monthlyRevenue,
                    revenueChange = $"+{revenueChange}%",
                    activeCourses,
                    enrolledStudents,
                    customerGrowth = "+12%", // Placeholder
                    appointmentGrowth = "+8%" // Placeholder
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy dữ liệu dashboard", error = ex.Message });
            }
        }

        [HttpGet("revenue-chart")]
        public async Task<IActionResult> GetRevenueChart([FromQuery] string period = "month")
        {
            try
            {
                var today = DateTime.UtcNow.Date;
                var data = new List<object>();

                if (period == "month")
                {
                    // Last 6 months
                    for (int i = 5; i >= 0; i--)
                    {
                        var month = today.AddMonths(-i);
                        var startOfMonth = new DateTime(month.Year, month.Month, 1, 0, 0, 0, DateTimeKind.Utc);
                        var endOfMonth = startOfMonth.AddMonths(1);

                        var revenue = await _context.Payments
                            .Where(p => p.PaidAt >= startOfMonth && p.PaidAt < endOfMonth)
                            .SumAsync(p => p.Amount);

                        data.Add(new
                        {
                            period = month.ToString("MMM yyyy", CultureInfo.GetCultureInfo("vi-VN")),
                            revenue = revenue
                        });
                    }
                }
                else if (period == "week")
                {
                    // Last 4 weeks
                    for (int i = 3; i >= 0; i--)
                    {
                        var weekStart = today.AddDays(-(int)today.DayOfWeek - (i * 7));
                        var weekEnd = weekStart.AddDays(7);

                        var revenue = await _context.Payments
                            .Where(p => p.PaidAt >= weekStart && p.PaidAt < weekEnd)
                            .SumAsync(p => p.Amount);

                        data.Add(new
                        {
                            period = $"Tuần {4 - i}",
                            revenue = revenue
                        });
                    }
                }

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy dữ liệu biểu đồ doanh thu", error = ex.Message });
            }
        }

        [HttpGet("appointment-trends")]
        public async Task<IActionResult> GetAppointmentTrends()
        {
            try
            {
                var today = DateTime.UtcNow.Date;
                var lastWeek = today.AddDays(-7);

                // Get completed status ID
                var completedStatusId = await _context.Status
                    .Where(s => s.statusname.ToLower().Contains("completed") || s.statusname.ToLower().Contains("hoàn thành"))
                    .Select(s => s.statusid)
                    .FirstOrDefaultAsync();

                var appointments = await _context.Appointments
                    .Where(a => a.appointmentdate >= lastWeek)
                    .ToListAsync();

                var grouped = appointments
                    .GroupBy(a => a.appointmentdate.Date)
                    .Select(g => new
                    {
                        date = g.Key.ToString("dd/MM"),
                        count = g.Count(),
                        completed = g.Count(a => a.statusid == completedStatusId)
                    })
                    .OrderBy(x => x.date)
                    .ToList();

                return Ok(grouped);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy dữ liệu xu hướng cuộc hẹn", error = ex.Message });
            }
        }

        [HttpGet("popular-services")]
        public async Task<IActionResult> GetPopularServices()
        {
            try
            {
                // Get completed status ID
                var completedStatusId = await _context.Status
                    .Where(s => s.statusname.ToLower().Contains("completed") || s.statusname.ToLower().Contains("hoàn thành"))
                    .Select(s => s.statusid)
                    .FirstOrDefaultAsync();

                var popularServices = await _context.Services
                    .Select(s => new
                    {
                        serviceName = s.ServiceName,
                        bookingCount = _context.Appointments.Count(a => a.serviceid == s.ServiceID),
                        revenue = _context.Appointments
                            .Where(a => a.serviceid == s.ServiceID && a.statusid == completedStatusId)
                            .Sum(a => a.price)
                    })
                    .OrderByDescending(x => x.bookingCount)
                    .Take(5)
                    .ToListAsync();

                return Ok(popularServices);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy dữ liệu dịch vụ phổ biến", error = ex.Message });
            }
        }

        [HttpGet("recent-activities")]
        public async Task<IActionResult> GetRecentActivities()
        {
            try
            {
                var today = DateTime.UtcNow.Date;
                var lastWeek = today.AddDays(-7);

                // Get completed status ID
                var completedStatusId = await _context.Status
                    .Where(s => s.statusname.ToLower().Contains("completed") || s.statusname.ToLower().Contains("hoàn thành"))
                    .Select(s => s.statusid)
                    .FirstOrDefaultAsync();

                var recentAppointments = await _context.Appointments
                    .Where(a => a.appointmentdate >= lastWeek)
                    .Include(a => a.Customer)
                    .Include(a => a.Service)
                    .OrderByDescending(a => a.appointmentdate)
                    .Take(5)
                    .ToListAsync();

                var recentAppointmentDtos = recentAppointments
                    .Select(a => new
                    {
                        type = "appointment",
                        title = $"Cuộc hẹn mới: {a.appointmentname}",
                        description = $"{(a.Customer != null ? a.Customer.Name : "Unknown")} - {(a.Service != null ? a.Service.ServiceName : "Unknown")}",
                        date = a.appointmentdate.ToUniversalTime(),
                        status = a.statusid == completedStatusId ? "completed" : "pending"
                    })
                    .ToList();

                var recentCustomers = await _context.Customers
                    .OrderByDescending(c => c.CustomerID) // This is a placeholder - you might want to add CreatedDate field
                    .Take(3)
                    .ToListAsync();

                var recentCustomerDtos = recentCustomers
                    .Select(c => new
                    {
                        type = "customer",
                        title = $"Khách hàng mới: {c.Name}",
                        description = c.Email,
                        date = DateTime.UtcNow, // Placeholder
                        status = "new"
                    })
                    .ToList();

                var activities = recentAppointmentDtos.Concat(recentCustomerDtos)
                    .OrderByDescending(x => x.date)
                    .Take(8)
                    .ToList();

                return Ok(activities);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy dữ liệu hoạt động gần đây", error = ex.Message });
            }
        }
        [HttpGet("user-stats/{customerId}")]
        public async Task<IActionResult> GetUserStats(Guid customerId)
        {
            try
            {
                // Only count successful payments
                var paidPaymentIds = await _context.Payments
                    .Where(p => p.CustomerId == customerId && p.Status == true)
                    .Select(p => p.PaymentId)
                    .ToListAsync();

                // Total packages (distinct courses purchased)
                var totalPackages = await _context.PaymentDetails
                    .Where(pd => pd.CustomerId == customerId && paidPaymentIds.Contains(pd.PaymentId))
                    .Select(pd => pd.CourseId)
                    .Distinct()
                    .CountAsync();

                // Total amount spent
                var totalSpent = await _context.Payments
                    .Where(p => p.CustomerId == customerId && p.Status == true)
                    .SumAsync(p => (decimal?)p.Amount) ?? 0;

                return Ok(new {
                    totalPackages,
                    totalSpent
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thống kê người dùng", error = ex.Message });
            }
        }
    }
} 