using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gym_be.Models.Entities
{
    [Table("payment_detail")]
    public class PaymentDetail
    {
        [Key]
        [Column("payment_detail_id")]
        public Guid PaymentDetailId { get; set; }

        [Column("paymentid")]
        public Guid PaymentId { get; set; }

        [Column("courseid")]
        public Guid CourseId { get; set; }

        [Column("price")]
        public decimal Price { get; set; }

        [Column("customerid")]
        public Guid? CustomerId { get; set; }
    }
} 