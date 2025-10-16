using gym_be.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gym_be.Models.Entities;


[Table("workoutcourse")]
public class WorkoutCourse
{
    [Key]
    [Column("courseid")]
    public Guid CourseId { get; set; }


    [Column("coursename")]
    public string CourseName { get; set; }

    [Column("imageurl")]
    public string ImageUrl { get; set; }

    [Column("personaltrainer")]
    public Guid PersonalTrainerId { get; set; }

    [Column("durationweek")]
    public int DurationWeek { get; set; }

    [Column("description")]
    public string Description { get; set; } 

    [Column("price")]
    public decimal Price { get; set; }
    
    public Customer PersonalTrainer { get; set; } 
    [Column("schedules", TypeName = "jsonb")]
    public List<Guid> Schedules { get; set; } = new List<Guid>();

    [Column("serviceid")]
    public Guid ServiceId { get; set; }

    [Column("startdate")]
    public DateTime StartDate { get; set; }

    [Column("enddate")]
    public DateTime EndDate { get; set; }
}
