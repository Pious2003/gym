using gym_be.Models.DTOs;
using gym_be.Models.Entities;

namespace gym_be.Services.Interfaces
{
    public interface IScheduleService
    {
        Task<IEnumerable<Schedule>> GetAllAsync();
        Task<Schedule?> GetByIdAsync(Guid id);
        Task<Schedule> CreateAsync(Schedule schedule);
        Task<bool> DeleteAsync(Guid id);

        Task<(IEnumerable<Schedule> data, int totalCount)> GetPagedAsync(string? keyword, int page, int pageSize);

        Task<IEnumerable<ScheduleOptionDto>> GetOptionsAsync();
        Task<Schedule> UpdateAsync(Guid id, ScheduleUpdateDto dto);
    }
}
