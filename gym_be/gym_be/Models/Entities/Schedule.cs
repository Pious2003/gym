using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gym_be.Models.Entities
{
    [Table("schedule")]
    public class Schedule
    {
        [Key]
        [Column("scheduleid")]
        public Guid scheduleid { get; set; }

        [Column("dayofweek")]
        public string DayOfWeek { get; set; }

        [Column("maxparticipants")]
        public int MaxParticipants { get; set; }

        [Column("starttime")]
        public DateTime StartTime { get; set; }  

        [Column("endtime")]
        public DateTime EndTime { get; set; }    

        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
