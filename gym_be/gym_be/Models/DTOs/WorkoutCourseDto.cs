namespace gym_be.Models.DTOs
{
    public class WorkoutCourseDto
    {
        public Guid CourseId { get; set; }
        public string CourseName { get; set; }
        public string ImageUrl { get; set; }
        public Guid PersonalTrainerId { get; set; }
        public int DurationWeek { get; set; }
        public string Description { get; set; }
        public string PersonalTrainerName { get; set; } 
        public decimal Price { get; set; }
        public Guid ServiceId { get; set; }
        public List<string> Schedules { get; set; } = new List<string>();
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
