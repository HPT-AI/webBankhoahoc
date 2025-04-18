import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { getMonitoringService } from '../services/monitoring/MonitoringServiceProvider';
import { MetricType } from '../services/monitoring/MonitoringService';
import { AlertConfig } from '../types/monitoring';

const monitoringService = getMonitoringService();

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['systemHealth'],
    queryFn: () => monitoringService.getSystemHealth(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useMetrics = (type: MetricType) => {
  return useQuery({
    queryKey: ['metrics', type],
    queryFn: () => monitoringService.getMetrics(type),
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useConfigureAlert = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (config: AlertConfig) => monitoringService.configureAlert(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useAcknowledgeIncident = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (incidentId: string) => monitoringService.acknowledgeIncident(incidentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};
