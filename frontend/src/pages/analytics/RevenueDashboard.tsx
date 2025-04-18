import React, { useState } from 'react';
import { Typography, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { DateRange } from '../../types/analytics';
import { useRevenueAnalytics } from '../../hooks/useAnalytics';
import RevenueOverview from '../../components/analytics/dashboard/RevenueOverview';
import RevenueChart from '../../components/analytics/dashboard/RevenueChart';
import TopSellingCourses from '../../components/analytics/dashboard/TopSellingCourses';
import DateRangePicker from '../../components/analytics/common/DateRangePicker';

const { Title } = Typography;

const RevenueDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data, isLoading } = useRevenueAnalytics(dateRange);

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>{t('analytics.revenueDashboard')}</Title>
      
      <DateRangePicker value={dateRange} onChange={setDateRange} />
      
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <>
          <RevenueOverview data={data} loading={isLoading} />
          <RevenueChart data={data} loading={isLoading} />
          <TopSellingCourses data={data} loading={isLoading} />
        </>
      )}
    </div>
  );
};

export default RevenueDashboard;
