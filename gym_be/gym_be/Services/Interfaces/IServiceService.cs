using gym_be.Models;

public interface IServiceService
{
    Task<IEnumerable<Service>> GetAllAsync();
    Task<Service?> GetByIdAsync(Guid id);
    Task<Service> CreateAsync(Service service);
    Task<Service> UpdateAsync(Guid id, Service service);
    Task<bool> DeleteAsync(Guid id);
    Task<(IEnumerable<Service> data, int totalCount)> GetPagedAsync(string? keyword, int page, int pageSize);
}