using gym_be.Models.DTOs;

namespace gym_be.Services
{
    public interface IWorkoutCourseService
    {
        Task<List<WorkoutCourseDto>> GetAllWorkoutCoursesAsync();

        Task<WorkoutCourseDto> GetWorkoutCourseByIdAsync(Guid courseId);

        Task CreateWorkoutCourseAsync(WorkoutCourseDto workoutCourseDto);

        Task<WorkoutCourseDto> UpdateWorkoutCourseAsync(WorkoutCourseDto workoutCourseDto);

        Task DeleteWorkoutCourseAsync(Guid courseId);
    }
}
