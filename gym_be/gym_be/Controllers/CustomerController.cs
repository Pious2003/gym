using Microsoft.AspNetCore.Mvc;
using gym_be.Models;
using gym_be.Services;
using gym_be.Models.Entities;
using gym_be.Services.Interfaces;
using gym_be.Models.DTOs;

namespace gym_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _service;

        public CustomerController(ICustomerService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _service.GetAllAsync();
            return Ok(customers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomerById(Guid id)
        {
            var customer = await _service.GetByIdAsync(id);
            if (customer == null) return NotFound();
            return Ok(customer);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] Customer customer)
        {
            var created = await _service.CreateAsync(customer);
            return CreatedAtAction(nameof(GetCustomerById), new { id = created.CustomerID }, created);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(Guid id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }


        [HttpGet("paged")]
        public async Task<IActionResult> GetPagedCustomers(
            [FromQuery] string? keyword = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var (data, total) = await _service.GetPagedAsync(keyword, page, pageSize);

            return Ok(new
            {
                totalItems = total,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)total / pageSize),
                items = data
            });
        }

        [HttpGet("options")]
        public async Task<IActionResult> GetOptions()
        {
            var options = await _service.GetOptionsAsync();
            return Ok(options);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(Guid id, [FromBody] CustomerUpdateDto dto)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null) return NotFound();
            existing.Name = dto.Name;
            existing.Email = dto.Email;
            existing.PhoneNumber = dto.PhoneNumber;
            existing.Address = dto.Address;
            if (dto.Type.HasValue) existing.Type = dto.Type.Value;
            if (dto.Status.HasValue) existing.Status = dto.Status.Value;
            existing.Height = dto.Height;
            existing.Weight = dto.Weight;
            existing.Gender = dto.Gender;
            await _service.UpdateAsync(id, existing);
            return Ok(existing);
        }

    }
}
