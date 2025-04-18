import React from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import ExportFeature from '../../components/analytics/reports/ExportFeature';

const { Title } = Typography;

const ExportPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>{t('analytics.exportReports')}</Title>
      <ExportFeature />
    </div>
  );
};

export default ExportPage;
