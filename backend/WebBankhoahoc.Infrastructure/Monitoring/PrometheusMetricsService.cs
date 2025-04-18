using Prometheus;
using WebBankhoahoc.Application.Interfaces;
using WebBankhoahoc.Domain.Models;

namespace WebBankhoahoc.Infrastructure.Monitoring;

public class PrometheusMetricsService : IMetricsPublisher
{
    private readonly Gauge _cpuUsage;
    private readonly Gauge _memoryUsage;
    private readonly Gauge _diskUsage;
    private readonly Gauge _activeConnections;
    private readonly Gauge _responseTime;
    private readonly Counter _errorCount;

    public PrometheusMetricsService()
    {
        _cpuUsage = Metrics.CreateGauge("webbank_cpu_usage_percent", "CPU usage in percent");
        _memoryUsage = Metrics.CreateGauge("webbank_memory_usage_percent", "Memory usage in percent");
        _diskUsage = Metrics.CreateGauge("webbank_disk_usage_percent", "Disk usage in percent");
        _activeConnections = Metrics.CreateGauge("webbank_active_connections", "Number of active connections");
        _responseTime = Metrics.CreateGauge("webbank_response_time_ms", "Response time in milliseconds");
        _errorCount = Metrics.CreateCounter("webbank_error_count", "Count of errors");
    }

    public void PublishMetrics(SystemMetrics metrics)
    {
        _cpuUsage.Set(metrics.CpuUsage);
        _memoryUsage.Set(metrics.MemoryUsage);
        _diskUsage.Set(metrics.DiskUsage);
        _activeConnections.Set(metrics.ActiveConnections);
        _responseTime.Set(metrics.ResponseTime);
        _errorCount.Inc(metrics.ErrorRate);
    }
}
