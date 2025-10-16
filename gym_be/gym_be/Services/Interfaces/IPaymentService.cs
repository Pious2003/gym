using gym_be.Models.Entities;

namespace gym_be.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<object> CreateCheckoutSessionAsync(CheckoutSessionRequest request);
        Task<object> SavePaymentAsync(SavePaymentRequest request);
        Task<IEnumerable<object>> GetMyCoursesAsync(Guid customerId);
        Task<IEnumerable<object>> GetMySchedulesAsync(Guid customerId);
        Task<IEnumerable<object>> GetPaymentHistoryAsync(Guid customerId);
    }

    public class CheckoutItem
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
    }

    public class CheckoutSessionRequest
    {
        public List<CheckoutItem> Items { get; set; }
        public string Origin { get; set; }
        public string CustomerId { get; set; }
    }

    public class SavePaymentRequest
    {
        public List<SavePaymentItem> Items { get; set; }
        public string CustomerId { get; set; }
    }

    public class SavePaymentItem
    {
        public string id { get; set; }
        public string coursename { get; set; }
        public decimal price { get; set; }
    }
} 