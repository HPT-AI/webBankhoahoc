import { useQuery } from '@tanstack/react-query';
import { DateRange } from '../types/analytics';
import { fetchRevenueAnalytics, fetchCommissionReport } from '../services/analytics';

export const useRevenueAnalytics = (dateRange: DateRange) => {
  return useQuery({
    queryKey: ['revenueAnalytics', dateRange],
    queryFn: () => fetchRevenueAnalytics(dateRange),
  });
};

export const useCommissionReport = (instructorId: string) => {
  return useQuery({
    queryKey: ['commissionReport', instructorId],
    queryFn: () => fetchCommissionReport(instructorId),
  });
};
