import { SystemHealth } from '../../types/monitoring';
import { AlertConfig } from '../../types/monitoring';
import { Metric } from '../../types/monitoring';

export enum MetricType {
  CPU = 'cpu',
  MEMORY = 'memory',
  DISK = 'disk',
  CONNECTIONS = 'connections',
  RESPONSE_TIME = 'responseTime',
  ERROR_RATE = 'errorRate'
}

export interface MonitoringService {
  getSystemHealth(): Promise<SystemHealth>;
  getMetrics(type: MetricType): Promise<Metric[]>;
  configureAlert(config: AlertConfig): Promise<void>;
  acknowledgeIncident(incidentId: string): Promise<void>;
}
