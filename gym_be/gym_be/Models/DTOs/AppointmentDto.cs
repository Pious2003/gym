using System.Text.Json.Serialization;

namespace gym_be.Models.DTOs
{
    public class AppointmentDto
    {
        [JsonPropertyName("appointmentid")]
        public Guid appointmentid { get; set; }
        [JsonPropertyName("appointmentname")]
        public string appointmentname { get; set; }
        [JsonPropertyName("appointmentdate")]
        public DateTime appointmentdate { get; set; }
        [JsonPropertyName("appointmenttime")]
        public TimeSpan appointmenttime { get; set; }
        [JsonPropertyName("price")]
        public decimal price { get; set; }
        [JsonPropertyName("customerid")]
        public Guid customerid { get; set; }
        [JsonPropertyName("statusid")]
        public Guid statusid { get; set; }
        [JsonPropertyName("serviceid")]
        public Guid serviceid { get; set; }
    }
}
