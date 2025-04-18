export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  periodRevenue: number;
  averageOrderValue: number;
  topSellingCourses: {
    courseId: string;
    title: string;
    revenue: number;
    sales: number;
  }[];
  revenueByDay: {
    date: string;
    amount: number;
  }[];
}

export interface CommissionReport {
  instructorId: string;
  instructorName: string;
  totalCommission: number;
  pendingPayout: number;
  lastPayout: {
    amount: number;
    date: string;
  };
  courseBreakdown: {
    courseId: string;
    title: string;
    commission: number;
    sales: number;
  }[];
}

export interface ReportConfig {
  reportType: 'revenue' | 'commission';
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  dateRange?: DateRange;
  instructorId?: string;
}

export interface ExportService {
  generateRevenueReport(dateRange: DateRange): Promise<Blob>;
  generateCommissionReport(instructorId: string): Promise<Blob>;
  scheduleAutomaticReports(config: ReportConfig): Promise<void>;
}
