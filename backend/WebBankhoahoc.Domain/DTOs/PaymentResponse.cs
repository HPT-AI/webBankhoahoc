namespace WebBankhoahoc.Domain.DTOs;

public class PaymentResponse
{
    public bool Success { get; set; }
    public string TransactionId { get; set; }
    public string RedirectUrl { get; set; }
    public string Message { get; set; }
    public string PaymentProvider { get; set; }
}
