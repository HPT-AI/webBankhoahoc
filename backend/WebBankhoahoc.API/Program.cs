using Microsoft.EntityFrameworkCore;
using Prometheus;
using WebBankhoahoc.API.Services;
using WebBankhoahoc.Application.Interfaces;
using WebBankhoahoc.Application.Services;
using WebBankhoahoc.Infrastructure.Monitoring;
using WebBankhoahoc.Infrastructure.Persistence;
using WebBankhoahoc.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

// Add DbContext
builder.Services.AddDbContext<MonitoringDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add repositories
builder.Services.AddScoped<IMonitoringRepository, MonitoringRepository>();

// Add services
builder.Services.AddScoped<IMonitoringService, MonitoringService>();
builder.Services.AddSingleton<IMetricsPublisher, PrometheusMetricsService>();

// Add background services
builder.Services.AddHostedService<MetricsCollectorService>();

// Add controllers
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Add Prometheus metrics middleware
app.UseMetricServer();
app.UseHttpMetrics();

app.MapControllers();

app.Run();
