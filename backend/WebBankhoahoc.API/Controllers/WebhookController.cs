using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;
using WebBankhoahoc.Domain.Interfaces;

namespace WebBankhoahoc.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebhookController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ICommissionService _commissionService;
    
    
    
    public WebhookController(
        IConfiguration configuration,
        ICommissionService commissionService)
    {
        _configuration = configuration;
        _commissionService = commissionService;
    }
    
    [HttpPost("stripe")]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        
        try
        {
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                _configuration["STRIPE_WEBHOOK_SECRET"]
            );
            
            if (stripeEvent.Type == "checkout.session.completed")
            {
                var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
                
                
                if (Guid.TryParse(session.ClientReferenceId, out Guid orderId))
                {
                    
                    await _commissionService.CalculateCommission(orderId);
                }
            }
            else if (stripeEvent.Type == "charge.refunded")
            {
                var charge = stripeEvent.Data.Object as Charge;
                
            }
            
            return Ok();
        }
        catch (StripeException)
        {
            return BadRequest();
        }
    }
    
    [HttpPost("vnpay")]
    public async Task<IActionResult> VNPayWebhook([FromForm] VNPayCallbackRequest request)
    {
        
        //     
        //         
        
        return Ok();
    }
}

public class VNPayCallbackRequest
{
    public string vnp_TxnRef { get; set; }
    public string vnp_Amount { get; set; }
    public string vnp_ResponseCode { get; set; }
    public string vnp_TransactionStatus { get; set; }
    public string vnp_SecureHash { get; set; }
}
