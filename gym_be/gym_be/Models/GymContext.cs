using gym_be.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace gym_be.Models
{
    public class GymContext : DbContext
    {
        public GymContext(DbContextOptions<GymContext> options)
            : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }

        public DbSet<Schedule> Schedules { get; set; }

        public DbSet<Service> Services { get; set; }

        public DbSet<WorkoutCourse> WorkoutCourses { get; set; }

        public DbSet<Appointment> Appointments { get; set; }

        public DbSet<Status> Status { get; set; }

        public DbSet<Payment> Payments { get; set; }
        public DbSet<PaymentDetail> PaymentDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("public");
        }
    }
}
