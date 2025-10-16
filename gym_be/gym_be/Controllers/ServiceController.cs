using gym_be.Models;
using gym_be.Models.Entities;
using gym_be.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace gym_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceService _service;

        public ServiceController(IServiceService service)
        {
            _service = service;
        }

        // GET: api/service
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var services = await _service.GetAllAsync();
            return Ok(services);
        }

        // GET: api/service/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // POST: api/service
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Service service)
        {
            var created = await _service.CreateAsync(service);
            return CreatedAtAction(nameof(GetById), new { id = created.ServiceID }, created);
        }

        // PUT: api/service/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Service updated)
        {
            try
            {
                var result = await _service.UpdateAsync(id, updated);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // DELETE: api/service/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _service.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }

        // ✅ GET: api/service/paged?keyword=xyz&page=1&pageSize=10
        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged(
            [FromQuery] string? keyword = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var (data, totalCount) = await _service.GetPagedAsync(keyword, page, pageSize);

            return Ok(new
            {
                totalItems = totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                items = data
            });
        }
    }
}
