using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using WebBankhoahoc.Domain.DTOs;
using WebBankhoahoc.Domain.Enums;
using WebBankhoahoc.Domain.Interfaces;

namespace WebBankhoahoc.Infrastructure.Services;

public class VNPayPaymentService : IPaymentService
{
    private readonly IConfiguration _configuration;
    private readonly string _vnpayTmnCode;
    private readonly string _vnpayHashSecret;
    private readonly string _vnpayPaymentUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private readonly string _vnpayApiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

    public VNPayPaymentService(IConfiguration configuration)
    {
        _configuration = configuration;
        _vnpayTmnCode = _configuration["VNPAY_TMN_CODE"];
        _vnpayHashSecret = _configuration["VNPAY_HASH_SECRET"];
    }

    public async Task<PaymentResponse> ProcessPayment(PaymentRequest request)
    {
        try
        {
            var vnpayParams = new Dictionary<string, string>
            {
                ["vnp_Version"] = "2.1.0",
                ["vnp_Command"] = "pay",
                ["vnp_TmnCode"] = _vnpayTmnCode,
                ["vnp_Amount"] = (Convert.ToInt64(request.Amount * 100)).ToString(), // Convert to VND cents
                ["vnp_CreateDate"] = DateTime.Now.ToString("yyyyMMddHHmmss"),
                ["vnp_CurrCode"] = request.Currency == "VND" ? "VND" : "VND", // VNPAY only supports VND
                ["vnp_IpAddr"] = "127.0.0.1", // In production, should be client IP
                ["vnp_Locale"] = "vn",
                ["vnp_OrderInfo"] = request.Description ?? "Course Purchase",
                ["vnp_OrderType"] = "other",
                ["vnp_ReturnUrl"] = request.ReturnUrl,
                ["vnp_TxnRef"] = GetTransactionRef(request.OrderId),
            };

            var sortedParams = vnpayParams.OrderBy(kvp => kvp.Key).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            
            var queryString = string.Join("&", sortedParams.Select(kvp => $"{WebUtility.UrlEncode(kvp.Key)}={WebUtility.UrlEncode(kvp.Value)}"));
            var signData = _vnpayHashSecret + queryString;
            var checkSum = ComputeHmacSHA512(signData, _vnpayHashSecret);
            
            queryString += $"&vnp_SecureHash={checkSum}";
            var paymentUrl = $"{_vnpayPaymentUrl}?{queryString}";

            return await Task.FromResult(new PaymentResponse
            {
                Success = true,
                TransactionId = vnpayParams["vnp_TxnRef"],
                RedirectUrl = paymentUrl,
                Message = "Redirect to VNPay payment page",
                PaymentProvider = "VNPAY"
            });
        }
        catch (Exception ex)
        {
            return new PaymentResponse
            {
                Success = false,
                Message = $"VNPay error: {ex.Message}",
                PaymentProvider = "VNPAY"
            };
        }
    }

    public async Task<PaymentStatus> CheckStatus(string transactionId)
    {
        try
        {
            var vnpayParams = new Dictionary<string, string>
            {
                ["vnp_Version"] = "2.1.0",
                ["vnp_Command"] = "querydr",
                ["vnp_TmnCode"] = _vnpayTmnCode,
                ["vnp_TxnRef"] = transactionId,
                ["vnp_OrderInfo"] = "Query transaction status",
                ["vnp_TransDate"] = DateTime.Now.ToString("yyyyMMddHHmmss"),
                ["vnp_CreateDate"] = DateTime.Now.ToString("yyyyMMddHHmmss"),
                ["vnp_IpAddr"] = "127.0.0.1",
            };

            var sortedParams = vnpayParams.OrderBy(kvp => kvp.Key).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            
            var queryString = string.Join("&", sortedParams.Select(kvp => $"{WebUtility.UrlEncode(kvp.Key)}={WebUtility.UrlEncode(kvp.Value)}"));
            var signData = _vnpayHashSecret + queryString;
            var checkSum = ComputeHmacSHA512(signData, _vnpayHashSecret);
            
            vnpayParams.Add("vnp_SecureHash", checkSum);

            return await Task.FromResult(PaymentStatus.Completed);
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
            var vnpayParams = new Dictionary<string, string>
            {
                ["vnp_Version"] = "2.1.0",
                ["vnp_Command"] = "refund",
                ["vnp_TmnCode"] = _vnpayTmnCode,
                ["vnp_TxnRef"] = transactionId,
                ["vnp_Amount"] = (Convert.ToInt64(amount * 100)).ToString(),
                ["vnp_OrderInfo"] = "Refund payment",
                ["vnp_TransDate"] = DateTime.Now.ToString("yyyyMMddHHmmss"),
                ["vnp_CreateDate"] = DateTime.Now.ToString("yyyyMMddHHmmss"),
                ["vnp_IpAddr"] = "127.0.0.1",
                ["vnp_CreateBy"] = "System",
            };

            var sortedParams = vnpayParams.OrderBy(kvp => kvp.Key).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            
            var queryString = string.Join("&", sortedParams.Select(kvp => $"{WebUtility.UrlEncode(kvp.Key)}={WebUtility.UrlEncode(kvp.Value)}"));
            var signData = _vnpayHashSecret + queryString;
            var checkSum = ComputeHmacSHA512(signData, _vnpayHashSecret);
            
            vnpayParams.Add("vnp_SecureHash", checkSum);

            return await Task.FromResult(true);
        }
        catch (Exception)
        {
            return false;
        }
    }

    private string GetTransactionRef(Guid orderId)
    {
        return $"{orderId:N}-{DateTime.UtcNow.Ticks}";
    }

    private string ComputeHmacSHA512(string data, string key)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var dataBytes = Encoding.UTF8.GetBytes(data);
        
        using var hmac = new HMACSHA512(keyBytes);
        var hashBytes = hmac.ComputeHash(dataBytes);
        
        StringBuilder hex = new StringBuilder(hashBytes.Length * 2);
        foreach (byte b in hashBytes)
        {
            hex.AppendFormat("{0:x2}", b);
        }
        
        return hex.ToString();
    }
}
