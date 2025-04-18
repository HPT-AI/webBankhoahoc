import React from 'react';
import { Typography, Layout } from 'antd';
import { useTranslation } from 'react-i18next';
import OrderHistory from '../components/order/OrderHistory';

const { Title } = Typography;
const { Content } = Layout;

const OrderHistoryPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Content style={{ padding: '20px' }}>
      <Title level={2}>{t('orderHistory.title')}</Title>
      <OrderHistory />
    </Content>
  );
};

export default OrderHistoryPage;
