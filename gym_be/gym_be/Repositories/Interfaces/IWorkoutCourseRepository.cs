using gym_be.Models.Entities;

namespace gym_be.Repositories.Interfaces
{
    public interface IWorkoutCourseRepository
    {
        Task<List<WorkoutCourse>> GetAllWorkoutCoursesAsync();

        Task<WorkoutCourse> GetWorkoutCourseByIdAsync(Guid courseId);
        Task CreateWorkoutCourseAsync(WorkoutCourse workoutCourse);

        Task UpdateWorkoutCourseAsync(WorkoutCourse workoutCourse);

        Task DeleteWorkoutCourseAsync(Guid courseId);
    }
}
