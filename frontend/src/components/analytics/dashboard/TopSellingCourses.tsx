import React from 'react';
import { Card, Table, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { RevenueAnalytics } from '../../../types/analytics';

interface TopSellingCoursesProps {
  data?: RevenueAnalytics;
  loading: boolean;
}

const TopSellingCourses: React.FC<TopSellingCoursesProps> = ({ data, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return <Spin size="large" />;
  }

  if (!data) {
    return null;
  }

  const columns = [
    {
      title: t('analytics.courseTitle'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('analytics.sales'),
      dataIndex: 'sales',
      key: 'sales',
      sorter: (a: { sales: number }, b: { sales: number }) => a.sales - b.sales,
    },
    {
      title: t('analytics.revenue'),
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `$${revenue.toFixed(2)}`,
      sorter: (a: { revenue: number }, b: { revenue: number }) => a.revenue - b.revenue,
    },
  ];

  return (
    <Card title={t('analytics.topSellingCourses')} style={{ marginTop: 16 }}>
      <Table 
        dataSource={data.topSellingCourses.map((course, index) => ({
          ...course,
          key: index,
        }))} 
        columns={columns} 
        pagination={false}
      />
    </Card>
  );
};

export default TopSellingCourses;
