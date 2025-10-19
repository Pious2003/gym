using System;

namespace gym_be.Models.DTOs
{
    public class ScheduleUpdateDto
    {
        public string DayOfWeek { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int MaxParticipants { get; set; }
    }
}
