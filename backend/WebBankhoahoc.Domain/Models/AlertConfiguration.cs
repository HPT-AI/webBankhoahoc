namespace WebBankhoahoc.Domain.Models;

public class AlertConfiguration
{
    public Guid Id { get; set; }
    public string MetricName { get; set; }
    public string Condition { get; set; }
    public double Threshold { get; set; }
    public string Severity { get; set; }
    public List<string> NotificationChannels { get; set; }
}
