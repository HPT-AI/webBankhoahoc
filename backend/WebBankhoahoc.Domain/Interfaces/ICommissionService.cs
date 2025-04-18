using System;
using System.Threading.Tasks;

namespace WebBankhoahoc.Domain.Interfaces;

public interface ICommissionService
{
    Task CalculateCommission(Guid orderId);
    Task ProcessInstructorPayouts();
}
