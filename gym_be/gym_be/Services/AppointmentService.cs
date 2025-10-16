using gym_be.Models.DTOs;
using gym_be.Models;
using gym_be.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using gym_be.Models.Entities;

namespace gym_be.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly GymContext _context;

        public AppointmentService(GymContext context)
        {
            _context = context;
        }

        public async Task<AppointmentDto> GetAppointmentByIdAsync(Guid appointmentid)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.appointmentid == appointmentid);

            if (appointment == null)
                return null;

            return new AppointmentDto
            {
                appointmentid = appointment.appointmentid,
                appointmentname = appointment.appointmentname,
                appointmentdate = appointment.appointmentdate,
                appointmenttime = appointment.appointmenttime,
                price = appointment.price,
                customerid = appointment.customerid,
                statusid = appointment.statusid,
                serviceid = appointment.serviceid
            };
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync(int page, int pageSize)
        {
            return await _context.Appointments
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new AppointmentDto
                {
                    appointmentid = a.appointmentid,
                    appointmentname = a.appointmentname,
                    appointmentdate = a.appointmentdate,
                    appointmenttime = a.appointmenttime,
                    price = a.price,
                    customerid = a.customerid,
                    statusid = a.statusid,
                    serviceid = a.serviceid
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync()
        {
            return await _context.Appointments
                .Select(a => new AppointmentDto
                {
                    appointmentid = a.appointmentid,
                    appointmentname = a.appointmentname,
                    appointmentdate = a.appointmentdate,
                    appointmenttime = a.appointmenttime,
                    price = a.price,
                    customerid = a.customerid,
                    statusid = a.statusid,
                    serviceid = a.serviceid
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<AppointmentDto>> SearchAppointmentsAsync(string searchQuery)
        {
            return await _context.Appointments
                .Where(a => a.appointmentname.Contains(searchQuery))
                .Select(a => new AppointmentDto
                {
                    appointmentid = a.appointmentid,
                    appointmentname = a.appointmentname,
                    appointmentdate = a.appointmentdate,
                    appointmenttime = a.appointmenttime,
                    price = a.price,
                    customerid = a.customerid,
                    statusid = a.statusid,
                    serviceid = a.serviceid
                })
                .ToListAsync();
        }

        public async Task<AppointmentDto> AddAppointmentAsync(AppointmentDto appointmentDto)
        {
            // Ensure DateTime.Kind is UTC for PostgreSQL
            appointmentDto.appointmentdate = DateTime.SpecifyKind(appointmentDto.appointmentdate, DateTimeKind.Utc);

            var appointment = new Appointment
            {
                appointmentid = Guid.NewGuid(),
                appointmentname = appointmentDto.appointmentname,
                appointmentdate = appointmentDto.appointmentdate,
                appointmenttime = appointmentDto.appointmenttime,
                price = appointmentDto.price,
                customerid = appointmentDto.customerid,
                statusid = appointmentDto.statusid,
                serviceid = appointmentDto.serviceid
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return new AppointmentDto
            {
                appointmentid = appointment.appointmentid,
                appointmentname = appointment.appointmentname,
                appointmentdate = appointment.appointmentdate,
                appointmenttime = appointment.appointmenttime,
                price = appointment.price,
                customerid = appointment.customerid,
                statusid = appointment.statusid,
                serviceid = appointment.serviceid
            };
        }

        public async Task<AppointmentDto> UpdateAppointmentAsync(Guid appointmentid, AppointmentDto appointmentDto)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.appointmentid == appointmentid);

            if (appointment == null)
                return null;

            appointment.appointmentname = appointmentDto.appointmentname;
            appointment.appointmentdate = DateTime.SpecifyKind(appointmentDto.appointmentdate, DateTimeKind.Utc);
            appointment.appointmenttime = appointmentDto.appointmenttime;
            appointment.price = appointmentDto.price;
            appointment.customerid = appointmentDto.customerid;
            appointment.statusid = appointmentDto.statusid;
            appointment.serviceid = appointmentDto.serviceid;

            await _context.SaveChangesAsync();

            return appointmentDto;
        }

        public async Task<bool> DeleteAppointmentAsync(Guid appointmentid)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.appointmentid == appointmentid);

            if (appointment == null)
                return false;

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}
