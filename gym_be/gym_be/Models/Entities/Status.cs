using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gym_be.Models.Entities
{
    [Table("status")]
    public class Status
    {
        [Key]
        [Column("statusid")]
        public Guid statusid { get; set; }

        [Column("statusname")]
        public string statusname { get; set; }
    }
} 