import React from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { DollarOutlined, ShoppingOutlined, LineChartOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { RevenueAnalytics } from '../../../types/analytics';

interface RevenueOverviewProps {
  data?: RevenueAnalytics;
  loading: boolean;
}

const RevenueOverview: React.FC<RevenueOverviewProps> = ({ data, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return <Spin size="large" />;
  }

  if (!data) {
    return null;
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Card>
          <Statistic
            title={t('analytics.totalRevenue')}
            value={data.totalRevenue}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix={<DollarOutlined />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title={t('analytics.periodRevenue')}
            value={data.periodRevenue}
            precision={2}
            valueStyle={{ color: '#1890ff' }}
            prefix={<LineChartOutlined />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title={t('analytics.averageOrderValue')}
            value={data.averageOrderValue}
            precision={2}
            valueStyle={{ color: '#722ed1' }}
            prefix={<ShoppingOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default RevenueOverview;
