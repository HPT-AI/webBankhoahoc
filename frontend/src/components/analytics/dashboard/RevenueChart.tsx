import React from 'react';
import { Card, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { Line } from '@ant-design/charts';
import { RevenueAnalytics } from '../../../types/analytics';

interface RevenueChartProps {
  data?: RevenueAnalytics;
  loading: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return <Spin size="large" />;
  }

  if (!data) {
    return null;
  }

  const config = {
    data: data.revenueByDay,
    xField: 'date',
    yField: 'amount',
    point: {
      size: 5,
      shape: 'diamond',
    },
    tooltip: {
      formatter: (datum: { amount: number }) => {
        return { name: t('analytics.revenue'), value: `$${datum.amount.toFixed(2)}` };
      },
    },
  };

  return (
    <Card title={t('analytics.revenueOverTime')} style={{ marginTop: 16 }}>
      <Line {...config} />
    </Card>
  );
};

export default RevenueChart;
