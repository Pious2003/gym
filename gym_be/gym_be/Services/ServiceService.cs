using gym_be.Models;
using gym_be.Models.Entities;
using gym_be.Repositories.Interfaces;
using gym_be.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace gym_be.Services
{
    public class ServiceService : IServiceService
    {
        private readonly IServiceRepository _repository;

        public ServiceService(IServiceRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Service>> GetAllAsync()
            => await _repository.GetAllAsync();

        public async Task<Service?> GetByIdAsync(Guid id)
            => await _repository.GetByIdAsync(id);

        public async Task<Service> CreateAsync(Service service)
        {
            service.ServiceID = Guid.NewGuid();
            await _repository.AddAsync(service);
            await _repository.SaveChangesAsync();
            return service;
        }

        public async Task<Service> UpdateAsync(Guid id, Service updated)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) throw new Exception("Không tìm thấy dịch vụ");

            existing.ServiceName = updated.ServiceName;
            existing.CourseDescription = updated.CourseDescription;
            existing.ServicePrice = updated.ServicePrice;

            await _repository.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return false;

            await _repository.DeleteAsync(id);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<(IEnumerable<Service> data, int totalCount)> GetPagedAsync(string? keyword, int page, int pageSize)
        {
            var query = _repository.Query();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                keyword = keyword.ToLower();
                query = query.Where(s =>
                    (s.ServiceName ?? "").ToLower().Contains(keyword) ||
                    (s.CourseDescription ?? "").ToLower().Contains(keyword));
            }

            var total = await query.CountAsync();

            var data = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (data, total);
        }
    }
}
