namespace gym_be.Models.DTOs
{
    public class RegisterDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public bool AgreeToTerms { get; set; }
        public int Type { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public int Status { get; set; }
        public string? Gender { get; set; }
    }
} 