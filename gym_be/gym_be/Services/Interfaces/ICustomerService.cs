using gym_be.Models.Entities;
using gym_be.Models.DTOs;

namespace gym_be.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<IEnumerable<Customer>> GetAllAsync();
        Task<Customer?> GetByIdAsync(Guid id);
        Task<Customer> CreateAsync(Customer customer);

        Task<Customer?> UpdateAsync(Guid id, Customer updatedCustomer);
        Task<bool> DeleteAsync(Guid id);
        Task<(IEnumerable<Customer> data, int totalCount)> GetPagedAsync(string? keyword, int page, int pageSize);

        Task<IEnumerable<CustomerOptionDto>> GetOptionsAsync();
        Task<Customer?> GetByEmailAsync(string email);
    }
}
