using WebBankhoahoc.Domain.Models;

namespace WebBankhoahoc.Application.Interfaces;

public interface IMetricsPublisher
{
    void PublishMetrics(SystemMetrics metrics);
}
