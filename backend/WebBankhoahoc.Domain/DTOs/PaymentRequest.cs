using System;

namespace WebBankhoahoc.Domain.DTOs;

public class PaymentRequest
{
    public Guid OrderId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string ReturnUrl { get; set; }
    public string CancelUrl { get; set; }
    public string PaymentProvider { get; set; } // STRIPE, VNPAY
    public string Description { get; set; }
    public string CustomerEmail { get; set; }
    public string CustomerName { get; set; }
}
