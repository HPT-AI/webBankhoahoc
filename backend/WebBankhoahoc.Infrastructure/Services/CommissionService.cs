using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using WebBankhoahoc.Domain.Interfaces;
using WebBankhoahoc.Domain.Models;

namespace WebBankhoahoc.Infrastructure.Services;

public class CommissionService : ICommissionService
{
    private readonly IConfiguration _configuration;
    
    private readonly decimal _defaultCommissionRate = 0.7m; // 70% to instructor
    
    public CommissionService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public async Task CalculateCommission(Guid orderId)
    {
        
        await Task.CompletedTask;
        
        /*
        var order = await _orderRepository.GetByIdAsync(orderId);
        
        if (order == null || order.Status != OrderStatus.Completed)
            return;
            
        foreach (var item in order.Items)
        {
            var course = await _courseRepository.GetByIdAsync(item.CourseId);
            
            if (course == null)
                continue;
                
            var rate = course.CommissionRate ?? _defaultCommissionRate;
            var amount = item.Price * rate;
            
            var commission = new Commission
            {
                Id = Guid.NewGuid(),
                InstructorId = course.InstructorId,
                CourseId = course.Id,
                Amount = amount,
                Rate = rate,
                CalculatedAt = DateTime.UtcNow,
                IsPaid = false
            };
            
            await _commissionRepository.AddAsync(commission);
        }
        
        await _commissionRepository.SaveChangesAsync();
        */
    }
    
    public async Task ProcessInstructorPayouts()
    {
        
        await Task.CompletedTask;
        
        /*
        var unpaidCommissions = await _commissionRepository.GetUnpaidCommissionsAsync();
        var groupedByInstructor = unpaidCommissions.GroupBy(c => c.InstructorId);
        
        foreach (var instructorGroup in groupedByInstructor)
        {
            var instructorId = instructorGroup.Key;
            var totalAmount = instructorGroup.Sum(c => c.Amount);
            
            bool payoutSuccessful = await ProcessPayoutToInstructor(instructorId, totalAmount);
            
            if (payoutSuccessful)
            {
                foreach (var commission in instructorGroup)
                {
                    commission.IsPaid = true;
                    await _commissionRepository.UpdateAsync(commission);
                }
            }
        }
        
        await _commissionRepository.SaveChangesAsync();
        */
    }
    
    private async Task<bool> ProcessPayoutToInstructor(Guid instructorId, decimal amount)
    {
        
        return await Task.FromResult(true);
    }
}
