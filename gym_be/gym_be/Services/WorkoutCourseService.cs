using gym_be.Models.DTOs;
using gym_be.Models.Entities;
using gym_be.Repositories.Interfaces;

namespace gym_be.Services
{
    public class WorkoutCourseService : IWorkoutCourseService
    {
        private readonly IWorkoutCourseRepository _workoutCourseRepository;

        public WorkoutCourseService(IWorkoutCourseRepository workoutCourseRepository)
        {
            _workoutCourseRepository = workoutCourseRepository;
        }

        public async Task<List<WorkoutCourseDto>> GetAllWorkoutCoursesAsync()
        {
            var courses = await _workoutCourseRepository.GetAllWorkoutCoursesAsync();
            return courses.Select(course => new WorkoutCourseDto
            {
                CourseId = course.CourseId,
                CourseName = course.CourseName,
                ImageUrl = course.ImageUrl,
                PersonalTrainerId = course.PersonalTrainerId,
                DurationWeek = course.DurationWeek,
                Description = course.Description,
                PersonalTrainerName = course.PersonalTrainer?.Name,
                Schedules = course.Schedules,
                Price = course.Price,
                ServiceId = course.ServiceId, // map serviceid
                StartDate = course.StartDate,
                EndDate = course.EndDate
            }).ToList();
        }

        public async Task<WorkoutCourseDto> GetWorkoutCourseByIdAsync(Guid courseId)
        {
            var course = await _workoutCourseRepository.GetWorkoutCourseByIdAsync(courseId);
            if (course == null)
                return null;

            return new WorkoutCourseDto
            {
                CourseId = course.CourseId,
                CourseName = course.CourseName,
                ImageUrl = course.ImageUrl,
                PersonalTrainerId = course.PersonalTrainerId,
                DurationWeek = course.DurationWeek,
                Description = course.Description,
                PersonalTrainerName = course.PersonalTrainer?.Name,
                Schedules = course.Schedules,
                Price = course.Price,
                ServiceId = course.ServiceId, // map serviceid
                StartDate = course.StartDate,
                EndDate = course.EndDate
            };
        }

        public async Task CreateWorkoutCourseAsync(WorkoutCourseDto workoutCourseDto)
        {
            var workoutCourse = new WorkoutCourse
            {
                CourseId = Guid.NewGuid(),
                CourseName = workoutCourseDto.CourseName,
                ImageUrl = workoutCourseDto.ImageUrl,
                PersonalTrainerId = workoutCourseDto.PersonalTrainerId,
                DurationWeek = workoutCourseDto.DurationWeek,
                Description = workoutCourseDto.Description,
                Schedules = workoutCourseDto.Schedules ?? new List<Guid>(),
                Price = workoutCourseDto.Price,
                ServiceId = workoutCourseDto.ServiceId, // map serviceid
                StartDate = workoutCourseDto.StartDate,
                EndDate = workoutCourseDto.EndDate
            };
            await _workoutCourseRepository.CreateWorkoutCourseAsync(workoutCourse);
        }

        public async Task<WorkoutCourseDto> UpdateWorkoutCourseAsync(WorkoutCourseDto workoutCourseDto)
        {
            var workoutCourse = await _workoutCourseRepository.GetWorkoutCourseByIdAsync(workoutCourseDto.CourseId);
            if (workoutCourse != null)
            {
                workoutCourse.CourseName = workoutCourseDto.CourseName;
                workoutCourse.ImageUrl = workoutCourseDto.ImageUrl;
                workoutCourse.PersonalTrainerId = workoutCourseDto.PersonalTrainerId;
                workoutCourse.DurationWeek = workoutCourseDto.DurationWeek;
                workoutCourse.Description = workoutCourseDto.Description;
                workoutCourse.Schedules = workoutCourseDto.Schedules ?? new List<Guid>();
                workoutCourse.Price = workoutCourseDto.Price;
                workoutCourse.ServiceId = workoutCourseDto.ServiceId; // map serviceid
                workoutCourse.StartDate = workoutCourseDto.StartDate;
                workoutCourse.EndDate = workoutCourseDto.EndDate;
                await _workoutCourseRepository.UpdateWorkoutCourseAsync(workoutCourse);
                // Map updated entity to DTO (including trainer name if needed)
                return new WorkoutCourseDto
                {
                    CourseId = workoutCourse.CourseId,
                    CourseName = workoutCourse.CourseName,
                    ImageUrl = workoutCourse.ImageUrl,
                    PersonalTrainerId = workoutCourse.PersonalTrainerId,
                    DurationWeek = workoutCourse.DurationWeek,
                    Description = workoutCourse.Description,
                    PersonalTrainerName = workoutCourse.PersonalTrainer?.Name,
                    Schedules = workoutCourse.Schedules,
                    Price = workoutCourse.Price,
                    ServiceId = workoutCourse.ServiceId,
                    StartDate = workoutCourse.StartDate,
                    EndDate = workoutCourse.EndDate
                };
            }
            return null;
        }

        public async Task DeleteWorkoutCourseAsync(Guid courseId)
        {
            await _workoutCourseRepository.DeleteWorkoutCourseAsync(courseId);
        }
    }
}
