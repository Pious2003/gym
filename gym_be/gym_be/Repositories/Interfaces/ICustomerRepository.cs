using gym_be.Models;
using gym_be.Models.Entities;

namespace gym_be.Repositories.Interfaces
{
    public interface ICustomerRepository
    {
        Task<IEnumerable<Customer>> GetAllAsync();
        Task<Customer?> GetByIdAsync(Guid id);
        Task AddAsync(Customer customer);
        Task DeleteAsync(Guid id);
        Task SaveChangesAsync();
        IQueryable<Customer> Query();

    }
}
