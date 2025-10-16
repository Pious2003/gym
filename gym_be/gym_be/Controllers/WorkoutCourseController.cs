using gym_be.Models.DTOs;
using gym_be.Services;
using Microsoft.AspNetCore.Mvc;
using gym_be.Models;
using gym_be.Models.Entities;

namespace gym_be.Controllers
{
    [Route("api/workout-course")]
    [ApiController]
    public class WorkoutCourseController : ControllerBase
    {
        private readonly IWorkoutCourseService _workoutCourseService;
        private readonly GymContext _context;

        public WorkoutCourseController(IWorkoutCourseService workoutCourseService, GymContext context)
        {
            _workoutCourseService = workoutCourseService;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWorkoutCourses()
        {
            var courses = await _workoutCourseService.GetAllWorkoutCoursesAsync();
            // For each course, include schedules if possible
            // If schedules are not related, return empty array
            var result = courses.Select(c => new {
                // Copy all properties (use lowercase keys)
                courseid = c.CourseId,
                coursename = c.CourseName,
                imageurl = c.ImageUrl,
                personaltrainerid = c.PersonalTrainerId,
                durationweek = c.DurationWeek,
                description = c.Description,
                personaltrainername = c.PersonalTrainerName,
                // Add schedules: [] (empty array or real data if available)
                schedules = c.Schedules,
                price = c.Price,
                serviceid = c.ServiceId // add serviceid
            });
            return Ok(result);
        }

        [HttpGet("{courseId}")]
        public async Task<IActionResult> GetWorkoutCourseById(Guid courseId)
        {
            var course = await _workoutCourseService.GetWorkoutCourseByIdAsync(courseId);
            if (course == null)
                return NotFound();

            return Ok(course);
        }

        [HttpPost]
        public async Task<IActionResult> CreateWorkoutCourse([FromBody] WorkoutCourseDto workoutCourseDto)
        {
            await _workoutCourseService.CreateWorkoutCourseAsync(workoutCourseDto);
            return CreatedAtAction(nameof(GetWorkoutCourseById), new { courseId = workoutCourseDto.CourseId }, workoutCourseDto);
        }

        [HttpPut("{courseId}")]
        public async Task<IActionResult> UpdateWorkoutCourseOld(Guid courseId, [FromBody] WorkoutCourseDto workoutCourseDto)
        {
            if (courseId != workoutCourseDto.CourseId)
                return BadRequest();

           var updatedCourse = await _workoutCourseService.UpdateWorkoutCourseAsync(workoutCourseDto);
            return Ok(updatedCourse);
        }

        [HttpDelete("{courseId}")]
        public async Task<IActionResult> DeleteWorkoutCourse(Guid courseId)
        {
            await _workoutCourseService.DeleteWorkoutCourseAsync(courseId);
            return NoContent();
        }

        [HttpGet("pt/{ptId}")]
        public IActionResult GetCoursesByPT(Guid ptId)
        {
            // Lấy các khóa học của PT này, kèm tên dịch vụ
            var courses = (from c in _context.WorkoutCourses
                          join s in _context.Services on c.ServiceId equals s.ServiceID into serviceJoin
                          from s in serviceJoin.DefaultIfEmpty()
                          where c.PersonalTrainerId == ptId
                          select new {
                              courseId = c.CourseId,
                              courseName = c.CourseName,
                              imageUrl = c.ImageUrl,
                              durationWeek = c.DurationWeek,
                              description = c.Description,
                              price = c.Price,
                              serviceName = s != null ? s.ServiceName : null,
                              schedules = c.Schedules
                          }).ToList();

            return Ok(courses);
        }

        [HttpGet("students/{courseId}")]
        public IActionResult GetStudentsByCourse(Guid courseId)
        {
            // Lấy danh sách học viên đã mua khoá học này
            var students = (from pd in _context.PaymentDetails
                           join p in _context.Payments on pd.PaymentId equals p.PaymentId
                           join c in _context.Customers on pd.CustomerId equals c.CustomerID
                           where pd.CourseId == courseId && p.Status == true
                           select new {
                               studentId = c.CustomerID,
                               studentName = c.Name,
                               studentEmail = c.Email,
                               studentPhone = c.PhoneNumber,
                               purchaseDate = p.PaidAt,
                               price = pd.Price
                           }).ToList();

            return Ok(students);
        }
    }
}
