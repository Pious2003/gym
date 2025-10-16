using System;

namespace gym_be.Models.DTOs
{
    public class CustomerUpdateDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }

        public float? Height { get; set; }
        public float? Weight { get; set; }
        public int? Type { get; set; }
        public int? Status { get; set; }
        public string? Gender { get; set; }
    }
} 