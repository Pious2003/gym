using gym_be.Models;
using gym_be.Models.Entities;
using gym_be.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace gym_be.Repositories.Implementations
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly GymContext _context;

        public ServiceRepository(GymContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Service>> GetAllAsync()
            => await _context.Services.ToListAsync();

        public async Task<Service?> GetByIdAsync(Guid id)
            => await _context.Services.FindAsync(id);

        public async Task AddAsync(Service service)
            => await _context.Services.AddAsync(service);

        public async Task DeleteAsync(Guid id)
        {
            var service = await GetByIdAsync(id);
            if (service != null)
            {
                _context.Services.Remove(service);
            }
        }

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();

        public IQueryable<Service> Query()
            => _context.Services.AsQueryable();
    }
}
