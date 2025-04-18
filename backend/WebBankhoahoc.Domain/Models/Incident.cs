namespace WebBankhoahoc.Domain.Models;

public class Incident
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public string Status { get; set; } // "Open", "Acknowledged", "Resolved"
    public string Severity { get; set; }
    public string MetricName { get; set; }
    public double MetricValue { get; set; }
    public double Threshold { get; set; }
}
