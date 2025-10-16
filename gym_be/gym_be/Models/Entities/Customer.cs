using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gym_be.Models.Entities
{
    [Table("customer")]
    public class Customer
    {
        [Key]
        [Column("customerid")]
        public Guid CustomerID { get; set; }

        [Column("name")]
        [MaxLength(50)]
        public string Name { get; set; }

        [Column("phonenumber")]
        [MaxLength(10)]
        public string PhoneNumber { get; set; }

        [Column("address")]
        [MaxLength(200)]
        public string Address { get; set; }

        [Column("height")]
        public float? Height { get; set; }

        [Column("weight")]
        public float? Weight { get; set; }

        [Column("email")]
        [MaxLength(50)]
        public string Email { get; set; }

        [Column("password")]
        [MaxLength(50)]
        public string Password { get; set; }

        [Column("type")]
        public int Type { get; set; }

        [Column("status")]
        public int Status { get; set; }

        [Column("gender")]
        [MaxLength(10)]
        public string? Gender { get; set; }

        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
