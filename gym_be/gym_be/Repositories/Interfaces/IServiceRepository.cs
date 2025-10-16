using gym_be.Models;
using gym_be.Models.Entities;

namespace gym_be.Repositories.Interfaces
{
    public interface IServiceRepository
    {
        Task<IEnumerable<Service>> GetAllAsync();
        Task<Service?> GetByIdAsync(Guid id);
        Task AddAsync(Service service);
        Task DeleteAsync(Guid id);
        Task SaveChangesAsync();
        IQueryable<Service> Query();
    }
}
