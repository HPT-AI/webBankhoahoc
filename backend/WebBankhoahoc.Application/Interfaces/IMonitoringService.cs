using WebBankhoahoc.Domain.Models;

namespace WebBankhoahoc.Application.Interfaces;

public interface IMonitoringService
{
    Task<SystemHealth> GetSystemHealthAsync();
    Task<List<SystemMetrics>> GetMetricsAsync(string metricType, DateTime from, DateTime to);
    Task<AlertConfiguration> ConfigureAlertAsync(AlertConfiguration alertConfig);
    Task AcknowledgeIncidentAsync(Guid incidentId);
    Task<List<Incident>> GetActiveIncidentsAsync();
    Task<SystemMetrics> CollectCurrentMetricsAsync();
    Task<List<SystemMetrics>> GeneratePerformanceReportAsync(DateTime from, DateTime to);
}
