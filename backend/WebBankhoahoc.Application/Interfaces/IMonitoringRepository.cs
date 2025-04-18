using WebBankhoahoc.Domain.Models;

namespace WebBankhoahoc.Application.Interfaces;

public interface IMonitoringRepository
{
    Task<SystemHealth> GetLatestSystemHealthAsync();
    Task<List<SystemMetrics>> GetMetricsAsync(string metricType, DateTime from, DateTime to);
    Task<List<AlertConfiguration>> GetAlertConfigurationsAsync();
    Task<AlertConfiguration> GetAlertConfigurationByIdAsync(Guid id);
    Task<AlertConfiguration> CreateAlertConfigurationAsync(AlertConfiguration alertConfiguration);
    Task UpdateAlertConfigurationAsync(AlertConfiguration alertConfiguration);
    Task DeleteAlertConfigurationAsync(Guid id);
    Task<List<Incident>> GetActiveIncidentsAsync();
    Task<Incident> GetIncidentByIdAsync(Guid id);
    Task<Incident> CreateIncidentAsync(Incident incident);
    Task UpdateIncidentAsync(Incident incident);
    Task<List<SystemMetrics>> GetLatestMetricsAsync(int count);
}
