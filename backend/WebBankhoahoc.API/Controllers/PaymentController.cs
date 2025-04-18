using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebBankhoahoc.Domain.DTOs;
using WebBankhoahoc.Domain.Interfaces;
using WebBankhoahoc.Domain.Models;

namespace WebBankhoahoc.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _stripePaymentService;
    private readonly IPaymentService _vnpayPaymentService;
    private readonly ICommissionService _commissionService;
    

    public PaymentController(
        [FromKeyedServices("STRIPE")] IPaymentService stripePaymentService,
        [FromKeyedServices("VNPAY")] IPaymentService vnpayPaymentService,
        ICommissionService commissionService)
    {
        _stripePaymentService = stripePaymentService;
        _vnpayPaymentService = vnpayPaymentService;
        _commissionService = commissionService;
    }
    
    [HttpPost("process")]
    [Authorize]
    public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequest request)
    {
        if (request == null)
            return BadRequest("Payment request is required");
            
        IPaymentService paymentService = request.PaymentProvider.ToUpper() switch
        {
            "STRIPE" => _stripePaymentService,
            "VNPAY" => _vnpayPaymentService,
            _ => _stripePaymentService // Default to Stripe
        };
        
        var response = await paymentService.ProcessPayment(request);
        
        if (!response.Success)
            return BadRequest(response);
            
        var transaction = new PaymentTransaction
        {
            Id = Guid.NewGuid(),
            OrderId = request.OrderId,
            PaymentProvider = request.PaymentProvider,
            TransactionId = response.TransactionId,
            Amount = request.Amount,
            Currency = request.Currency,
            Status = Domain.Enums.PaymentStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };
        
            
        return Ok(response);
    }
    
    [HttpGet("status/{transactionId}")]
    [Authorize]
    public async Task<IActionResult> CheckStatus(string transactionId, [FromQuery] string provider)
    {
        if (string.IsNullOrEmpty(transactionId))
            return BadRequest("Transaction ID is required");
            
        IPaymentService paymentService = provider.ToUpper() switch
        {
            "STRIPE" => _stripePaymentService,
            "VNPAY" => _vnpayPaymentService,
            _ => _stripePaymentService // Default to Stripe
        };
        
        var status = await paymentService.CheckStatus(transactionId);
        
        return Ok(new { Status = status.ToString() });
    }
    
    [HttpPost("refund")]
    [Authorize]
    public async Task<IActionResult> RefundPayment([FromBody] RefundRequest request)
    {
        if (request == null)
            return BadRequest("Refund request is required");
            
        IPaymentService paymentService = request.PaymentProvider.ToUpper() switch
        {
            "STRIPE" => _stripePaymentService,
            "VNPAY" => _vnpayPaymentService,
            _ => _stripePaymentService // Default to Stripe
        };
        
        var result = await paymentService.RefundPayment(request.TransactionId, request.Amount);
        
        if (!result)
            return BadRequest("Refund failed");
            
            
        return Ok(new { Success = true, Message = "Refund processed successfully" });
    }
}
