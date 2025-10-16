using gym_be.Models;
using gym_be.Models.Entities;
using gym_be.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace gym_be.Repositories.Implementations
{
    public class ScheduleRepository : IScheduleRepository
    {
        private readonly GymContext _context;

        public ScheduleRepository(GymContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Schedule>> GetAllAsync() => await _context.Schedules.ToListAsync();

        public async Task<Schedule?> GetByIdAsync(Guid id) => await _context.Schedules.FindAsync(id);

        public async Task AddAsync(Schedule schedule) => await _context.Schedules.AddAsync(schedule);

        public async Task DeleteAsync(Guid id)
        {
            var s = await GetByIdAsync(id);
            if (s != null) _context.Schedules.Remove(s);
        }

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();

        public IQueryable<Schedule> Query() => _context.Schedules.AsQueryable();
    }
}
