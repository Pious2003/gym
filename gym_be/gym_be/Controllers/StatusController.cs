using gym_be.Models.Entities;
using gym_be.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace gym_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatusController : ControllerBase
    {
        private readonly GymContext _context;
        public StatusController(GymContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Status>>> GetAllStatuses()
        {
            return Ok(await _context.Status.ToListAsync());
        }
    }
} 