using System;

namespace WebBankhoahoc.Domain.Models;

public class Commission
{
    public Guid Id { get; set; }
    public Guid InstructorId { get; set; }
    public Guid CourseId { get; set; }
    public decimal Amount { get; set; }
    public decimal Rate { get; set; }
    public DateTime CalculatedAt { get; set; }
    public bool IsPaid { get; set; }
}
