using gym_be.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace gym_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecommendationController : ControllerBase
    {
        private readonly GymContext _context;
        public RecommendationController(GymContext context)
        {
            _context = context;
        }

        public class RecommendRequest
        {
            public float Height { get; set; } // cm
            public float Weight { get; set; } // kg
        }

        [HttpPost]
        public async Task<IActionResult> Recommend([FromBody] RecommendRequest req)
        {
            if (req.Height <= 0 || req.Weight <= 0)
                return BadRequest("Height and weight must be positive.");

            var bmi = req.Weight / Math.Pow(req.Height / 100.0, 2);
            var courses = await _context.WorkoutCourses.ToListAsync();
            var services = await _context.Services.ToListAsync();

            // Rule-based filter
            var recommended = courses.Where(c => {
                var serviceName = services.FirstOrDefault(s => s.ServiceID == c.ServiceId)?.ServiceName?.ToLower() ?? "";
                if (bmi < 18.5)
                    return serviceName.Contains("yoga") || serviceName.Contains("pilates") || serviceName.Contains("tăng cân");
                else if (bmi < 25)
                    return serviceName.Contains("gym") || serviceName.Contains("pilates") || serviceName.Contains("yoga") || serviceName.Contains("zumba") || serviceName.Contains("fitness");
                else
                    return serviceName.Contains("cardio") || serviceName.Contains("zumba") || serviceName.Contains("giảm cân") || serviceName.Contains("fitness");
            }).ToList();

            // Trả về danh sách courseid được gợi ý
            var result = recommended.Select(c => c.CourseId);
            return Ok(result);
        }
    }
} 