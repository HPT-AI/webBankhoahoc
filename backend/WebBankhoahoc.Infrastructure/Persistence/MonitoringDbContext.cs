using Microsoft.EntityFrameworkCore;
using WebBankhoahoc.Domain.Models;

namespace WebBankhoahoc.Infrastructure.Persistence;

public class MonitoringDbContext : DbContext
{
    public MonitoringDbContext(DbContextOptions<MonitoringDbContext> options) : base(options)
    {
    }

    public DbSet<SystemMetrics> SystemMetrics { get; set; }
    public DbSet<AlertConfiguration> AlertConfigurations { get; set; }
    public DbSet<SystemHealth> SystemHealthChecks { get; set; }
    public DbSet<Incident> Incidents { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AlertConfiguration>()
            .Property(e => e.NotificationChannels)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());

        modelBuilder.Entity<SystemHealth>()
            .Property(e => e.Issues)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());
    }
}
