using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using Newtonsoft.Json;
using gym_be.Models;
using gym_be.Models.Entities;
using gym_be.Services.Interfaces;
using System.Globalization;
using System.Text.RegularExpressions;

namespace gym_be.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly GymContext _context;

        public PaymentService(GymContext context)
        {
            _context = context;

        }

        public async Task<object> CreateCheckoutSessionAsync(CheckoutSessionRequest request)
        {
            StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("");

            var origin = request.Origin;
            var successUrl = $"{origin}/user/cart?success=true";
            var cancelUrl = $"{origin}/user/cart?canceled=true";

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = request.Items.Select(item => new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = (long)(item.Price),
                        Currency = "vnd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = item.Name,
                        },
                    },
                    Quantity = 1,
                }).ToList(),
                Mode = "payment",
                SuccessUrl = successUrl,
                CancelUrl = cancelUrl,
                Metadata = new Dictionary<string, string>
                {
                    { "customerid", request.CustomerId ?? "" },
                    { "courses", JsonConvert.SerializeObject(request.Items) }
                }
            };

            var service = new SessionService();
            Session session = service.Create(options);

            // Already camelCase
            return new { url = session.Url };
        }

        public async Task<object> SavePaymentAsync(SavePaymentRequest request)
        {
            var paymentId = Guid.NewGuid();
            var paidAt = DateTime.UtcNow;
            decimal total = request.Items.Sum(i => (decimal)(i.price));

            var payment = new Payment
            {
                PaymentId = paymentId,
                Amount = total,
                CustomerId = Guid.TryParse(request.CustomerId?.ToString(), out var cid) ? cid : (Guid?)null,
                Status = true,
                PaidAt = paidAt,
                Method = true
            };
            _context.Payments.Add(payment);

            foreach (var item in request.Items)
            {
                Guid courseGuid = Guid.TryParse(item.id?.ToString(), out var parsedId) ? parsedId : Guid.Empty;
                var detail = new PaymentDetail
                {
                    PaymentDetailId = Guid.NewGuid(),
                    PaymentId = paymentId,
                    CourseId = courseGuid,
                    Price = (decimal)item.price,
                    CustomerId = Guid.TryParse(request.CustomerId?.ToString(), out var cid2) ? cid2 : (Guid?)null
                };
                _context.PaymentDetails.Add(detail);
            }
            await _context.SaveChangesAsync();
            // Already camelCase
            return new { message = "Payment saved" };
        }

        public async Task<IEnumerable<object>> GetMyCoursesAsync(Guid customerId)
        {
            // Lấy các paymentId đã thanh toán thành công của customer
            var paidPaymentIds = _context.Payments
                .Where(p => p.CustomerId == customerId && p.Status == true)
                .Select(p => p.PaymentId)
                .ToList();

            // Lấy các khoá học đã mua, kèm tên dịch vụ (servicename) và tên PT (ptname)
            var courseList = (from pd in _context.PaymentDetails
                              join c in _context.WorkoutCourses on pd.CourseId equals c.CourseId
                              join s in _context.Services on c.ServiceId equals s.ServiceID into serviceJoin
                              from s in serviceJoin.DefaultIfEmpty()
                              join pt in _context.Customers on c.PersonalTrainerId equals pt.CustomerID into ptJoin
                              from pt in ptJoin.DefaultIfEmpty()
                              where pd.CustomerId == customerId && paidPaymentIds.Contains(pd.PaymentId)
                              select new {
                                  courseId = c.CourseId,
                                  courseName = c.CourseName,
                                  imageUrl = c.ImageUrl,
                                  personalTrainerId = c.PersonalTrainerId,
                                  durationWeek = c.DurationWeek,
                                  description = c.Description,
                                  price = c.Price,
                                  serviceId = c.ServiceId,
                                  serviceName = s != null ? s.ServiceName : null,
                                  ptName = pt != null ? pt.Name : null,
                                  schedules = c.Schedules
                              }).ToList();

            return courseList;
        }

        public async Task<IEnumerable<object>> GetMySchedulesAsync(Guid customerId)
        {
            // Lấy các paymentId đã thanh toán thành công của customer
            var paidPaymentIds = _context.Payments
                .Where(p => p.CustomerId == customerId && p.Status == true)
                .Select(p => p.PaymentId)
                .ToList();

            // Lấy các khoá học đã mua
            var courseIds = _context.PaymentDetails
                .Where(pd => pd.CustomerId == customerId && paidPaymentIds.Contains(pd.PaymentId))
                .Select(pd => pd.CourseId)
                .Distinct()
                .ToList();

            // Lấy tất cả WorkoutCourse liên quan
            var courses = _context.WorkoutCourses
                .Where(c => courseIds.Contains(c.CourseId))
                .AsEnumerable()
                .ToList();

            // Tạo ánh xạ scheduleid -> (PersonalTrainerId, CourseId)
            var scheduleCourseMap = new Dictionary<Guid, (Guid PersonalTrainerId, Guid CourseId)>();
            foreach (var course in courses)
            {
                foreach (var scheduleid in course.Schedules)
                {
                    scheduleCourseMap[scheduleid] = (course.PersonalTrainerId, course.CourseId);
                }
            }

            // Lấy tất cả scheduleid
            var scheduleids = scheduleCourseMap.Keys.ToList();

            // Lấy thông tin chi tiết các schedule
            var schedules = _context.Schedules
                .Where(s => scheduleids.Contains(s.scheduleid))
                .ToList();

            // Lấy danh sách giáo viên
            var trainerIds = scheduleCourseMap.Values.Select(x => x.PersonalTrainerId).Distinct().ToList();
            var trainers = _context.Customers
                .Where(c => trainerIds.Contains(c.CustomerID))
                .ToDictionary(c => c.CustomerID, c => c.Name);

            // Trả về schedule kèm tên giáo viên và tên khoá học
            var result = courses.Select(c => new {
                teacherName = trainers.ContainsKey(c.PersonalTrainerId)
                    ? trainers[c.PersonalTrainerId]
                    : "Không rõ",
                courseId = c.CourseId,
                courseName = c.CourseName,
                courseStartDate = c.StartDate,
                courseEndDate = c.EndDate,
                duration = c.DurationWeek,
                schedules = schedules
                    .Where(s => c.Schedules.Contains(s.scheduleid))
                    .Select(s => new {
                        scheduleid = s.scheduleid,
                        dayOfWeek = s.DayOfWeek,
                        startTime = s.StartTime,
                        endTime = s.EndTime
                    })
                    .ToList()
            }).ToList();

            return result;
        }

        public async Task<IEnumerable<object>> GetPaymentHistoryAsync(Guid customerId)
        {
            var paymentHistory = (from p in _context.Payments
                                 join pd in _context.PaymentDetails on p.PaymentId equals pd.PaymentId
                                 join c in _context.WorkoutCourses on pd.CourseId equals c.CourseId
                                 join pt in _context.Customers on c.PersonalTrainerId equals pt.CustomerID into ptJoin
                                 from pt in ptJoin.DefaultIfEmpty()
                                 where p.CustomerId == customerId
                                 orderby p.PaidAt descending
                                 select new
                                 {
                                     paymentId = p.PaymentId.ToString(),
                                     courseId = c.CourseId.ToString(),
                                     courseName = c.CourseName,
                                     instructor = pt != null ? pt.Name : "Không rõ",
                                     amount = pd.Price,
                                     originalAmount = c.Price,
                                     status = p.Status == true ? "completed" : "failed",
                                     date = p.PaidAt.HasValue ? p.PaidAt.Value.ToString("yyyy-MM-dd") : DateTime.Now.ToString("yyyy-MM-dd"),
                                     paymentMethod = p.Method == true ? "Thẻ tín dụng" : "Chuyển khoản",
                                     transactionId = p.PaymentId.ToString(), // Sử dụng paymentId thay cho mã giao dịch
                                    //  discount = c.Price - pd.Price,
                                     paidAt = p.PaidAt
                                 }).ToList();
            var result = paymentHistory.Cast<object>().ToList();
            return result;
        }
    }
} 