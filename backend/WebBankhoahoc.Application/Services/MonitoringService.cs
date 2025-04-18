using WebBankhoahoc.Application.Interfaces;
using WebBankhoahoc.Domain.Models;

namespace WebBankhoahoc.Application.Services;

public class MonitoringService : IMonitoringService
{
    private readonly IMonitoringRepository _repository;

    public MonitoringService(IMonitoringRepository repository)
    {
        _repository = repository;
    }

    public async Task<SystemHealth> GetSystemHealthAsync()
    {
        var latestMetrics = await _repository.GetLatestMetricsAsync(1);
        var latestHealth = await _repository.GetLatestSystemHealthAsync();
        
        if (latestMetrics.Count > 0)
        {
            latestHealth.Metrics = latestMetrics;
            
            var issues = new List<string>();
            var metrics = latestMetrics[0];
            
            if (metrics.CpuUsage > 80) issues.Add("High CPU usage");
            if (metrics.MemoryUsage > 80) issues.Add("High memory usage");
            if (metrics.DiskUsage > 80) issues.Add("High disk usage");
            if (metrics.ResponseTime > 1000) issues.Add("Slow response time");
            if (metrics.ErrorRate > 5) issues.Add("High error rate");
            
            latestHealth.Issues = issues;
            
            if (issues.Count == 0)
                latestHealth.Status = "Healthy";
            else if (issues.Count <= 2)
                latestHealth.Status = "Degraded";
            else
                latestHealth.Status = "Unhealthy";
        }
        
        return latestHealth;
    }

    public async Task<List<SystemMetrics>> GetMetricsAsync(string metricType, DateTime from, DateTime to)
    {
        return await _repository.GetMetricsAsync(metricType, from, to);
    }

    public async Task<AlertConfiguration> ConfigureAlertAsync(AlertConfiguration alertConfig)
    {
        if (alertConfig.Id == Guid.Empty)
        {
            alertConfig.Id = Guid.NewGuid();
            return await _repository.CreateAlertConfigurationAsync(alertConfig);
        }
        else
        {
            await _repository.UpdateAlertConfigurationAsync(alertConfig);
            return alertConfig;
        }
    }

    public async Task AcknowledgeIncidentAsync(Guid incidentId)
    {
        var incident = await _repository.GetIncidentByIdAsync(incidentId);
        if (incident != null)
        {
            incident.Status = "Acknowledged";
            await _repository.UpdateIncidentAsync(incident);
        }
    }

    public async Task<List<Incident>> GetActiveIncidentsAsync()
    {
        return await _repository.GetActiveIncidentsAsync();
    }

    public async Task<SystemMetrics> CollectCurrentMetricsAsync()
    {
        var random = new Random();
        var metrics = new SystemMetrics
        {
            Id = Guid.NewGuid(),
            CpuUsage = random.NextDouble() * 100,
            MemoryUsage = random.NextDouble() * 100,
            DiskUsage = random.NextDouble() * 100,
            ActiveConnections = random.Next(0, 1000),
            ResponseTime = random.Next(10, 2000),
            ErrorRate = random.Next(0, 10),
            Timestamp = DateTime.UtcNow
        };
        
        await CheckAlertsAsync(metrics);
        
        return metrics;
    }

    private async Task CheckAlertsAsync(SystemMetrics metrics)
    {
        var alertConfigurations = await _repository.GetAlertConfigurationsAsync();
        
        foreach (var alert in alertConfigurations)
        {
            bool isTriggered = false;
            double metricValue = 0;
            
            switch (alert.MetricName.ToLower())
            {
                case "cpu":
                    metricValue = metrics.CpuUsage;
                    isTriggered = EvaluateCondition(metrics.CpuUsage, alert.Condition, alert.Threshold);
                    break;
                case "memory":
                    metricValue = metrics.MemoryUsage;
                    isTriggered = EvaluateCondition(metrics.MemoryUsage, alert.Condition, alert.Threshold);
                    break;
                case "disk":
                    metricValue = metrics.DiskUsage;
                    isTriggered = EvaluateCondition(metrics.DiskUsage, alert.Condition, alert.Threshold);
                    break;
                case "connections":
                    metricValue = metrics.ActiveConnections;
                    isTriggered = EvaluateCondition(metrics.ActiveConnections, alert.Condition, alert.Threshold);
                    break;
                case "responsetime":
                    metricValue = metrics.ResponseTime;
                    isTriggered = EvaluateCondition(metrics.ResponseTime, alert.Condition, alert.Threshold);
                    break;
                case "errorrate":
                    metricValue = metrics.ErrorRate;
                    isTriggered = EvaluateCondition(metrics.ErrorRate, alert.Condition, alert.Threshold);
                    break;
            }
            
            if (isTriggered)
            {
                var incident = new Incident
                {
                    Id = Guid.NewGuid(),
                    Title = $"{alert.MetricName} alert triggered",
                    Description = $"{alert.MetricName} is {metricValue} {alert.Condition} {alert.Threshold}",
                    CreatedAt = DateTime.UtcNow,
                    Status = "Open",
                    Severity = alert.Severity,
                    MetricName = alert.MetricName,
                    MetricValue = metricValue,
                    Threshold = alert.Threshold
                };
                
                await _repository.CreateIncidentAsync(incident);
                
            }
        }
    }

    private bool EvaluateCondition(double value, string condition, double threshold)
    {
        return condition switch
        {
            ">" => value > threshold,
            ">=" => value >= threshold,
            "<" => value < threshold,
            "<=" => value <= threshold,
            "=" => value == threshold,
            _ => false
        };
    }

    public async Task<List<SystemMetrics>> GeneratePerformanceReportAsync(DateTime from, DateTime to)
    {
        return await _repository.GetMetricsAsync("all", from, to);
    }
}
