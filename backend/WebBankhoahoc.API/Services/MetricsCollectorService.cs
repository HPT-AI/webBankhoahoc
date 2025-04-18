using WebBankhoahoc.Application.Interfaces;

namespace WebBankhoahoc.API.Services;

public class MetricsCollectorService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly TimeSpan _interval = TimeSpan.FromMinutes(1);
    private readonly ILogger<MetricsCollectorService> _logger;

    public MetricsCollectorService(
        IServiceProvider serviceProvider,
        ILogger<MetricsCollectorService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Metrics Collector Service is starting.");

        using var timer = new PeriodicTimer(_interval);

        while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var monitoringService = scope.ServiceProvider.GetRequiredService<IMonitoringService>();
                
                var metrics = await monitoringService.CollectCurrentMetricsAsync();
                
                _logger.LogDebug("Metrics collected: CPU: {CPU}%, Memory: {Memory}%, Disk: {Disk}%", 
                    metrics.CpuUsage, metrics.MemoryUsage, metrics.DiskUsage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while collecting metrics");
            }
        }
    }
}
