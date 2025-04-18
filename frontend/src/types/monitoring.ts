export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
  responseTime: number;
  errorRate: number;
}

export interface SystemHealth {
  status: string;
  timestamp: string;
  metrics: SystemMetrics;
  issues: string[];
}

export interface AlertConfig {
  id?: string;
  metricName: string;
  condition: string;
  threshold: number;
  severity: string;
  notificationChannels: string[];
}

export interface Metric {
  name: string;
  value: number;
  timestamp: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  resolvedAt?: string;
  status: 'Open' | 'Acknowledged' | 'Resolved';
  severity: string;
  metricName: string;
  metricValue: number;
  threshold: number;
}
