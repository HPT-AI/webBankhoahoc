using Microsoft.EntityFrameworkCore;
using WebBankhoahoc.Application.Interfaces;
using WebBankhoahoc.Domain.Models;
using WebBankhoahoc.Infrastructure.Persistence;

namespace WebBankhoahoc.Infrastructure.Repositories;

public class MonitoringRepository : IMonitoringRepository
{
    private readonly MonitoringDbContext _context;

    public MonitoringRepository(MonitoringDbContext context)
    {
        _context = context;
    }

    public async Task<SystemHealth> GetLatestSystemHealthAsync()
    {
        return await _context.SystemHealthChecks
            .OrderByDescending(h => h.Timestamp)
            .FirstOrDefaultAsync() ?? new SystemHealth
            {
                Id = Guid.NewGuid(),
                Status = "Unknown",
                Timestamp = DateTime.UtcNow,
                Metrics = new List<SystemMetrics>(),
                Issues = new List<string>()
            };
    }

    public async Task<List<SystemMetrics>> GetMetricsAsync(string metricType, DateTime from, DateTime to)
    {
        return await _context.SystemMetrics
            .Where(m => m.Timestamp >= from && m.Timestamp <= to)
            .OrderBy(m => m.Timestamp)
            .ToListAsync();
    }

    public async Task<List<AlertConfiguration>> GetAlertConfigurationsAsync()
    {
        return await _context.AlertConfigurations.ToListAsync();
    }

    public async Task<AlertConfiguration> GetAlertConfigurationByIdAsync(Guid id)
    {
        return await _context.AlertConfigurations.FindAsync(id);
    }

    public async Task<AlertConfiguration> CreateAlertConfigurationAsync(AlertConfiguration alertConfiguration)
    {
        _context.AlertConfigurations.Add(alertConfiguration);
        await _context.SaveChangesAsync();
        return alertConfiguration;
    }

    public async Task UpdateAlertConfigurationAsync(AlertConfiguration alertConfiguration)
    {
        _context.Entry(alertConfiguration).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAlertConfigurationAsync(Guid id)
    {
        var alertConfiguration = await _context.AlertConfigurations.FindAsync(id);
        if (alertConfiguration != null)
        {
            _context.AlertConfigurations.Remove(alertConfiguration);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<Incident>> GetActiveIncidentsAsync()
    {
        return await _context.Incidents
            .Where(i => i.Status != "Resolved")
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
    }

    public async Task<Incident> GetIncidentByIdAsync(Guid id)
    {
        return await _context.Incidents.FindAsync(id);
    }

    public async Task<Incident> CreateIncidentAsync(Incident incident)
    {
        _context.Incidents.Add(incident);
        await _context.SaveChangesAsync();
        return incident;
    }

    public async Task UpdateIncidentAsync(Incident incident)
    {
        _context.Entry(incident).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task<List<SystemMetrics>> GetLatestMetricsAsync(int count)
    {
        return await _context.SystemMetrics
            .OrderByDescending(m => m.Timestamp)
            .Take(count)
            .ToListAsync();
    }
}
