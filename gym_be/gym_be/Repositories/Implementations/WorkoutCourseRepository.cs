using gym_be.Models;
using gym_be.Models.Entities;
using gym_be.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace gym_be.Repositories.Implementations
{
    public class WorkoutCourseRepository : IWorkoutCourseRepository
    {
        private readonly GymContext _context;

        public WorkoutCourseRepository(GymContext context)
        {
            _context = context;
        }

        public async Task<List<WorkoutCourse>> GetAllWorkoutCoursesAsync()
        {
            return await _context.WorkoutCourses.Include(wc => wc.PersonalTrainer).ToListAsync();
        }

        public async Task<WorkoutCourse> GetWorkoutCourseByIdAsync(Guid courseId)
        {
            return await _context.WorkoutCourses
                .Include(wc => wc.PersonalTrainer)
                .FirstOrDefaultAsync(wc => wc.CourseId == courseId);
        }

        public async Task CreateWorkoutCourseAsync(WorkoutCourse workoutCourse)
        {
            await _context.WorkoutCourses.AddAsync(workoutCourse);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateWorkoutCourseAsync(WorkoutCourse workoutCourse)
        {
            _context.WorkoutCourses.Update(workoutCourse);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteWorkoutCourseAsync(Guid courseId)
        {
            var workoutCourse = await _context.WorkoutCourses.FindAsync(courseId);
            if (workoutCourse != null)
            {
                _context.WorkoutCourses.Remove(workoutCourse);
                await _context.SaveChangesAsync();
            }
        }
    }
}
