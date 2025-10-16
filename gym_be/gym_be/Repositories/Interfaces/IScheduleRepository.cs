using gym_be.Models.Entities;

namespace gym_be.Repositories.Interfaces
{
    public interface IScheduleRepository
    {
        Task<IEnumerable<Schedule>> GetAllAsync();
        Task<Schedule?> GetByIdAsync(Guid id);
        Task AddAsync(Schedule schedule);
        Task DeleteAsync(Guid id);
        Task SaveChangesAsync();
        IQueryable<Schedule> Query();
    }
}
