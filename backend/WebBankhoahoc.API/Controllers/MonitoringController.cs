using Microsoft.AspNetCore.Mvc;
using WebBankhoahoc.Application.Interfaces;
using WebBankhoahoc.Domain.Models;

namespace WebBankhoahoc.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MonitoringController : ControllerBase
{
    private readonly IMonitoringService _monitoringService;

    public MonitoringController(IMonitoringService monitoringService)
    {
        _monitoringService = monitoringService;
    }

    [HttpGet("health")]
    public async Task<ActionResult<SystemHealth>> GetSystemHealth()
    {
        var health = await _monitoringService.GetSystemHealthAsync();
        return Ok(health);
    }

    [HttpGet("metrics/{metricType}")]
    public async Task<ActionResult<List<SystemMetrics>>> GetMetrics(string metricType, [FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        var metrics = await _monitoringService.GetMetricsAsync(metricType, from, to);
        return Ok(metrics);
    }

    [HttpPost("alerts")]
    public async Task<ActionResult<AlertConfiguration>> ConfigureAlert(AlertConfiguration alertConfig)
    {
        var result = await _monitoringService.ConfigureAlertAsync(alertConfig);
        return Ok(result);
    }

    [HttpPost("incidents/{incidentId}/acknowledge")]
    public async Task<ActionResult> AcknowledgeIncident(Guid incidentId)
    {
        await _monitoringService.AcknowledgeIncidentAsync(incidentId);
        return NoContent();
    }

    [HttpGet("incidents")]
    public async Task<ActionResult<List<Incident>>> GetActiveIncidents()
    {
        var incidents = await _monitoringService.GetActiveIncidentsAsync();
        return Ok(incidents);
    }

    [HttpGet("report")]
    public async Task<ActionResult<List<SystemMetrics>>> GeneratePerformanceReport([FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        var report = await _monitoringService.GeneratePerformanceReportAsync(from, to);
        return Ok(report);
    }
}
