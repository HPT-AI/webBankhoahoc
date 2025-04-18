using System;
using WebBankhoahoc.Domain.Enums;

namespace WebBankhoahoc.Domain.Models;

public class PaymentTransaction
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public string PaymentProvider { get; set; } // STRIPE, VNPAY
    public string TransactionId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; }
    public PaymentStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}
