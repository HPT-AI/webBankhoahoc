import axios from 'axios';
import { MonitoringService, MetricType } from './MonitoringService';
import { SystemHealth, AlertConfig, Metric } from '../../types/monitoring';

export class MonitoringServiceImpl implements MonitoringService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const response = await axios.get<SystemHealth>(`${this.baseUrl}/monitoring/health`);
    return response.data;
  }

  async getMetrics(type: MetricType): Promise<Metric[]> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const response = await axios.get<Metric[]>(
      `${this.baseUrl}/monitoring/metrics/${type}`,
      {
        params: {
          from: oneHourAgo.toISOString(),
          to: now.toISOString()
        }
      }
    );
    return response.data;
  }

  async configureAlert(config: AlertConfig): Promise<void> {
    await axios.post(`${this.baseUrl}/monitoring/alerts`, config);
  }

  async acknowledgeIncident(incidentId: string): Promise<void> {
    await axios.post(`${this.baseUrl}/monitoring/incidents/${incidentId}/acknowledge`);
  }
}
