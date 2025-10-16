using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace gym_be.Models.Entities
{
    [Table("appointment")]
    public class Appointment
    {
        [Key]
        [Column("appointmentid")]
        public Guid appointmentid { get; set; }

        [Column("appointmentname")]
        public string appointmentname { get; set; }

        [Column("appointmentdate")]
        public DateTime appointmentdate { get; set; }

        [Column("appointmenttime")]
        public TimeSpan appointmenttime { get; set; }

        [Column("price")]
        public decimal price { get; set; }

        [Column("customerid")]
        public Guid customerid { get; set; }

        [Column("serviceid")]
        public Guid serviceid { get; set; }

        public Customer Customer { get; set; }

        public Service Service { get; set; }

        [Column("statusid")]
        public Guid statusid { get; set; }
    }
}
