using System;

namespace gym_be.Models.DTOs
{
    public class ScheduleUpdateDto
    {
        public string DayOfWeek { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int MaxParticipants { get; set; }
    }
}
