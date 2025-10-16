using gym_be.Models;
using gym_be.Models.Entities;
using gym_be.Repositories.Interfaces;
using gym_be.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using gym_be.Models.DTOs;

namespace gym_be.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _repository;

        public CustomerService(ICustomerRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Customer>> GetAllAsync()
            => await _repository.GetAllAsync();

        public async Task<Customer?> GetByIdAsync(Guid id)
            => await _repository.GetByIdAsync(id);

        public async Task<Customer> CreateAsync(Customer customer)
        {
            try
            {
                customer.CustomerID = Guid.NewGuid();
                customer.Status = 1;
                await _repository.AddAsync(customer);
                await _repository.SaveChangesAsync();
                return customer;
            }
            catch (Exception ex)
            {
                throw new Exception("Lỗi khi tạo khách hàng mới", ex);
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return false;
            await _repository.DeleteAsync(id);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<(IEnumerable<Customer> data, int totalCount)> GetPagedAsync(string? keyword, int page, int pageSize)
        {
            var query = _repository.Query();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                keyword = keyword.ToLower();
                query = query.Where(c =>
                    c.Name.ToLower().Contains(keyword) ||
                    c.Email.ToLower().Contains(keyword));
            }

            int total = await query.CountAsync();

            var data = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (data, total);
        }

        public async Task<IEnumerable<CustomerOptionDto>> GetOptionsAsync()
        {
            var result = await _repository
                .Query()
                .Select(c => new CustomerOptionDto
                {
                    Value = c.CustomerID,
                    Label = c.Name
                })
                .ToListAsync();

            return result;
        }

        public async Task<Customer?> UpdateAsync(Guid id, Customer updatedCustomer)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return null;

            // Cập nhật trường
            existing.Name = updatedCustomer.Name;
            existing.Email = updatedCustomer.Email;
            existing.PhoneNumber = updatedCustomer.PhoneNumber;
            existing.Address = updatedCustomer.Address;
            existing.Type = updatedCustomer.Type;
            // Các trường khác nếu có...
            existing.Height = updatedCustomer.Height;
            existing.Weight = updatedCustomer.Weight;

            await _repository.SaveChangesAsync();
            return existing;
        }

        public async Task<Customer?> GetByEmailAsync(string email)
        {
            return await _repository.Query().FirstOrDefaultAsync(c => c.Email == email);
        }
    }
}
