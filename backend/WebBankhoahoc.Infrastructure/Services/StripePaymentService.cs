using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;
using WebBankhoahoc.Domain.DTOs;
using WebBankhoahoc.Domain.Enums;
using WebBankhoahoc.Domain.Interfaces;

namespace WebBankhoahoc.Infrastructure.Services;

public class StripePaymentService : IPaymentService
{
    private readonly IConfiguration _configuration;
    
    public StripePaymentService(IConfiguration configuration)
    {
        _configuration = configuration;
        StripeConfiguration.ApiKey = _configuration["STRIPE_SECRET_KEY"];
    }

    public async Task<PaymentResponse> ProcessPayment(PaymentRequest request)
    {
        try
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = (long)(request.Amount * 100), // Convert to cents
                            Currency = request.Currency.ToLower(),
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = request.Description ?? "Course Purchase",
                            },
                        },
                        Quantity = 1,
                    },
                },
                Mode = "payment",
                SuccessUrl = request.ReturnUrl + "?session_id={CHECKOUT_SESSION_ID}",
                CancelUrl = request.CancelUrl,
                CustomerEmail = request.CustomerEmail,
                ClientReferenceId = request.OrderId.ToString(),
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);

            return new PaymentResponse
            {
                Success = true,
                TransactionId = session.Id,
                RedirectUrl = session.Url,
                Message = "Redirect to Stripe payment page",
                PaymentProvider = "STRIPE"
            };
        }
        catch (Exception ex)
        {
            return new PaymentResponse
            {
                Success = false,
                Message = $"Stripe error: {ex.Message}",
                PaymentProvider = "STRIPE"
            };
        }
    }

    public async Task<PaymentStatus> CheckStatus(string transactionId)
    {
        try
        {
            var service = new SessionService();
            var session = await service.GetAsync(transactionId);

            return session.PaymentStatus.ToLower() switch
            {
                "paid" => PaymentStatus.Completed,
                "unpaid" => PaymentStatus.Pending,
                _ => PaymentStatus.Processing
            };
        }
        catch (Exception)
        {
            return PaymentStatus.Failed;
        }
    }

    public async Task<bool> RefundPayment(string transactionId, decimal amount)
    {
        try
        {
            var service = new SessionService();
            var session = await service.GetAsync(transactionId);
            
            var paymentIntentService = new PaymentIntentService();
            var paymentIntent = await paymentIntentService.GetAsync(session.PaymentIntentId);
            
            var refundService = new RefundService();
            var refundOptions = new RefundCreateOptions
            {
                PaymentIntent = paymentIntent.Id,
                Amount = (long)(amount * 100), // Convert to cents
            };
            
            var refund = await refundService.CreateAsync(refundOptions);
            
            return refund.Status.ToLower() == "succeeded";
        }
        catch (Exception)
        {
            return false;
        }
    }
}
