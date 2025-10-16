using gym_be.Models;
using gym_be.Models.Entities;
using gym_be.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace gym_be.Repositories.Implementations
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly GymContext _context;

        public CustomerRepository(GymContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Customer>> GetAllAsync()
            => await _context.Customers.ToListAsync();

        public async Task<Customer?> GetByIdAsync(Guid id)
            => await _context.Customers.FindAsync(id);

        public async Task AddAsync(Customer customer)
            => await _context.Customers.AddAsync(customer);

        public async Task DeleteAsync(Guid id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
            }
        }

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();

        public IQueryable<Customer> Query() => _context.Customers.AsQueryable();
    }
}
