import React from 'react';
import { Typography, Layout } from 'antd';
import { useTranslation } from 'react-i18next';
import CheckoutFlow from '../components/checkout/CheckoutFlow';

const { Title } = Typography;
const { Content } = Layout;

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Content style={{ padding: '20px' }}>
      <Title level={2}>{t('checkout.title')}</Title>
      <CheckoutFlow />
    </Content>
  );
};

export default CheckoutPage;
