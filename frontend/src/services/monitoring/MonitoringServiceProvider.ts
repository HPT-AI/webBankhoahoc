import { MonitoringService } from './MonitoringService';
import { MonitoringServiceImpl } from './MonitoringServiceImpl';

let monitoringService: MonitoringService | null = null;

export const getMonitoringService = (): MonitoringService => {
  if (!monitoringService) {
    monitoringService = new MonitoringServiceImpl();
  }
  return monitoringService;
};
