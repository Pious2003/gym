using Microsoft.AspNetCore.Mvc;
using gym_be.Services.Interfaces;

namespace gym_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("create-checkout-session")]
        public async Task<IActionResult> CreateCheckoutSession([FromBody] CheckoutSessionRequest request)
        {
            var result = await _paymentService.CreateCheckoutSessionAsync(request);
            return Ok(result);
        }

        [HttpPost("save")]
        public async Task<IActionResult> SavePayment([FromBody] SavePaymentRequest request)
        {
            var result = await _paymentService.SavePaymentAsync(request);
            return Ok(result);
        }

        [HttpGet("my-courses/{customerId}")]
        public async Task<IActionResult> GetMyCourses(Guid customerId)
        {
            var result = await _paymentService.GetMyCoursesAsync(customerId);
            return Ok(result);
        }

        [HttpGet("my-schedules/{customerId}")]
        public async Task<IActionResult> GetMySchedules(Guid customerId)
        {
            var result = await _paymentService.GetMySchedulesAsync(customerId);
            return Ok(result);
        }

        [HttpGet("history/{customerId}")]
        public async Task<IActionResult> GetPaymentHistory(Guid customerId)
        {
            var result = await _paymentService.GetPaymentHistoryAsync(customerId);
            return Ok(result);
        }
    }
}