using Microsoft.AspNetCore.Mvc;
using gym_be.Models.Entities;
using gym_be.Models.DTOs;
using gym_be.Services.Interfaces;

namespace gym_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleService _service;

        public ScheduleController(IScheduleService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var schedules = await _service.GetAllAsync();
            return Ok(schedules);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var schedule = await _service.GetByIdAsync(id);
            if (schedule == null) return NotFound();
            return Ok(schedule);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Schedule schedule)
        {
            var created = await _service.CreateAsync(schedule);
            return CreatedAtAction(nameof(GetById), new { id = created.scheduleid }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ScheduleUpdateDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _service.DeleteAsync(id);
            return result ? NoContent() : NotFound();
        }

        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged(
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
    }
}
