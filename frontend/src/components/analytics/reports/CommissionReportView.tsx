import React from 'react';
import { Card, Row, Col, Statistic, Divider, Table, Button, Space, Spin } from 'antd';
import { DollarOutlined, ClockCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { CommissionReport } from '../../../types/analytics';
import { analyticsService } from '../../../services/analytics';

interface CommissionReportViewProps {
  data?: CommissionReport;
  loading: boolean;
}

const CommissionReportView: React.FC<CommissionReportViewProps> = ({ data, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return <Spin size="large" />;
  }

  if (!data) {
    return null;
  }

  const handleExport = async () => {
    if (!data) return;
    
    const blob = await analyticsService.generateCommissionReport(data.instructorId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commission_report_${data.instructorId}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
    },
    {
      title: t('analytics.commission'),
      dataIndex: 'commission',
      key: 'commission',
      render: (commission: number) => `$${commission.toFixed(2)}`,
    },
  ];

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Statistic
              title={t('analytics.totalCommission')}
              value={data.totalCommission}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="$"
            />
          </Col>
          <Col span={8}>
            <Statistic
              title={t('analytics.pendingPayout')}
              value={data.pendingPayout}
              precision={2}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
              suffix="$"
            />
          </Col>
          <Col span={8}>
            <Statistic
              title={t('analytics.lastPayout')}
              value={data.lastPayout.amount}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              prefix={<HistoryOutlined />}
              suffix={`$ (${data.lastPayout.date})`}
            />
          </Col>
        </Row>
      </Card>

      <Divider>{t('analytics.courseBreakdown')}</Divider>

      <Card>
        <Table 
          dataSource={data.courseBreakdown.map((course, index) => ({
            ...course,
            key: index,
          }))} 
          columns={columns} 
          pagination={false}
        />
      </Card>

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Space>
          <Button type="primary" onClick={handleExport}>
            {t('analytics.exportReport')}
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default CommissionReportView;
