using System.Threading.Tasks;
using WebBankhoahoc.Domain.DTOs;
using WebBankhoahoc.Domain.Enums;

namespace WebBankhoahoc.Domain.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponse> ProcessPayment(PaymentRequest request);
    Task<PaymentStatus> CheckStatus(string transactionId);
    Task<bool> RefundPayment(string transactionId, decimal amount);
}
