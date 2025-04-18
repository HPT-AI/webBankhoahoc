namespace WebBankhoahoc.Domain.DTOs;

public class RefundRequest
{
    public string TransactionId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentProvider { get; set; }
}
