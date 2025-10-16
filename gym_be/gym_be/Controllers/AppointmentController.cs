using gym_be.Models.DTOs;
using gym_be.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using gym_be.Models.Entities;
using Microsoft.EntityFrameworkCore;
using gym_be.Models;

namespace gym_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly GymContext _context;

        public AppointmentController(IAppointmentService appointmentService, GymContext context)
        {
            _appointmentService = appointmentService;
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDto>> GetAppointmentById(Guid id)
        {
            var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
            if (appointment == null)
                return NotFound();

            return Ok(appointment);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAppointments()
        {
            var appointments = await _appointmentService.GetAllAppointmentsAsync();
            return Ok(appointments);
        }

        [HttpGet("my-appointments/{customerId}")]
        public async Task<IActionResult> GetMyAppointments(Guid customerId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.customerid == customerId)
                .Include(a => a.Service)
                .Include(a => a.Customer)
                .Select(a => new
                {
                    appointmentId = a.appointmentid,
                    appointmentName = a.appointmentname,
                    appointmentDate = a.appointmentdate,
                    appointmentTime = a.appointmenttime,
                    price = a.price,
                    serviceName = a.Service != null ? a.Service.ServiceName : "Không rõ",
                    
                    status = a.statusid
                })
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> SearchAppointments(string query)
        {
            var appointments = await _appointmentService.SearchAppointmentsAsync(query);
            return Ok(appointments);
        }

        [HttpPost]
        public async Task<ActionResult<AppointmentDto>> AddAppointment([FromBody] AppointmentDto appointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var appointment = await _appointmentService.AddAppointmentAsync(appointmentDto);
            return CreatedAtAction(nameof(GetAppointmentById), new { id = appointment.appointmentid }, appointment);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AppointmentDto>> UpdateAppointment(Guid id, AppointmentDto appointmentDto)
        {
            var updatedAppointment = await _appointmentService.UpdateAppointmentAsync(id, appointmentDto);
            if (updatedAppointment == null)
                return NotFound();

            return Ok(updatedAppointment);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAppointment(Guid id)
        {
            var success = await _appointmentService.DeleteAppointmentAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
