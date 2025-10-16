using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gym_be.Models.Entities
{
    [Table("payment")]
    public class Payment
    {
        [Key]
        [Column("paymentid")]
        public Guid PaymentId { get; set; }

        [Column("amount")]
        public decimal Amount { get; set; }

        [Column("method")]
        public bool? Method { get; set; }

        [Column("status")]
        public bool? Status { get; set; }

        [Column("paidat")]
        public DateTime? PaidAt { get; set; }

        [Column("customerid")]
        public Guid? CustomerId { get; set; }
    }
} 