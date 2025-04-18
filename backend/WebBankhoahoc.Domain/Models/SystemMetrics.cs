namespace WebBankhoahoc.Domain.Models;

public class SystemMetrics
{
    public Guid Id { get; set; }
    public double CpuUsage { get; set; }
    public double MemoryUsage { get; set; }
    public double DiskUsage { get; set; }
    public int ActiveConnections { get; set; }
    public double ResponseTime { get; set; }
    public int ErrorRate { get; set; }
    public DateTime Timestamp { get; set; }
}
