import { 
  RevenueAnalytics, 
  CommissionReport, 
  DateRange,
  ReportConfig
} from '../../types/analytics';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchRevenueAnalytics = async (_dateRange: DateRange): Promise<RevenueAnalytics> => {
  return {
    totalRevenue: 125000,
    periodRevenue: 15000,
    averageOrderValue: 75,
    topSellingCourses: [
      { courseId: 'c1', title: 'JavaScript Fundamentals', revenue: 5000, sales: 67 },
      { courseId: 'c2', title: 'React Masterclass', revenue: 4200, sales: 56 },
      { courseId: 'c3', title: 'Python for Beginners', revenue: 3800, sales: 51 },
      { courseId: 'c4', title: 'Data Science Bootcamp', revenue: 3500, sales: 47 },
      { courseId: 'c5', title: 'Web Development Basics', revenue: 3000, sales: 40 },
    ],
    revenueByDay: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 1000) + 200,
      };
    }),
  };
};

export const fetchCommissionReport = async (instructorId: string): Promise<CommissionReport> => {
  return {
    instructorId,
    instructorName: `Instructor ${instructorId}`,
    totalCommission: 18500,
    pendingPayout: 3200,
    lastPayout: {
      amount: 2500,
      date: new Date().toISOString().split('T')[0],
    },
    courseBreakdown: [
      { courseId: 'c1', title: 'JavaScript Fundamentals', commission: 3500, sales: 67 },
      { courseId: 'c2', title: 'React Masterclass', commission: 2940, sales: 56 },
      { courseId: 'c4', title: 'Data Science Bootcamp', commission: 2450, sales: 47 },
    ],
  };
};

export const analyticsService = {
  generateRevenueReport: async (dateRange: DateRange): Promise<Blob> => {
    const analytics = await fetchRevenueAnalytics(dateRange);
    const jsonContent = JSON.stringify(analytics, null, 2);
    return new Blob([jsonContent], { type: 'application/json' });
  },
  
  generateCommissionReport: async (instructorId: string): Promise<Blob> => {
    const report = await fetchCommissionReport(instructorId);
    const jsonContent = JSON.stringify(report, null, 2);
    return new Blob([jsonContent], { type: 'application/json' });
  },
  
  scheduleAutomaticReports: async (config: ReportConfig): Promise<void> => {
    console.log('Scheduled report with config:', config);
    return Promise.resolve();
  },
};
