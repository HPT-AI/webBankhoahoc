namespace WebBankhoahoc.Domain.Models;

public class SystemHealth
{
    public Guid Id { get; set; }
    public string Status { get; set; } // "Healthy", "Degraded", "Unhealthy"
    public DateTime Timestamp { get; set; }
    public List<SystemMetrics> Metrics { get; set; }
    public List<string> Issues { get; set; }
}
