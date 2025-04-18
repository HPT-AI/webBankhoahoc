import React, { useState } from 'react';
import { Typography, Input, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCommissionReport } from '../../hooks/useAnalytics';
import CommissionReportView from '../../components/analytics/reports/CommissionReportView';

const { Title } = Typography;
const { Search } = Input;

const CommissionReportPage: React.FC = () => {
  const { t } = useTranslation();
  const [instructorId, setInstructorId] = useState<string>('');
  const [searchedId, setSearchedId] = useState<string>('');

  const { data, isLoading } = useCommissionReport(searchedId);

  const handleSearch = (value: string) => {
    setSearchedId(value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>{t('analytics.commissionReports')}</Title>
      
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <Search
          placeholder={t('analytics.enterInstructorId')}
          enterButton={t('analytics.search')}
          size="large"
          value={instructorId}
          onChange={(e) => setInstructorId(e.target.value)}
          onSearch={handleSearch}
        />
      </Space>
      
      {searchedId && (
        <CommissionReportView data={data} loading={isLoading} />
      )}
    </div>
  );
};

export default CommissionReportPage;
