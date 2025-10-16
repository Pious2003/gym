using gym_be.Models.Entities;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gym_be.Models
{
    [Table("service")]
    public class Service
    {
        
        [Key]
        [Column("serviceid")]
        public Guid ServiceID { get; set; }

        [Required]
        [Column("servicename")]
        [MaxLength(50)]
        public string ServiceName { get; set; }

        [MaxLength(256)]
        [Column("coursedescription")]
        public string? CourseDescription { get; set; }

        [Column("serviceprice")]
        [Range(0, double.MaxValue)]
        public decimal ServicePrice { get; set; }

        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
