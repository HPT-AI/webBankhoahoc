import React from 'react';
import { Typography, Layout } from 'antd';
import { useTranslation } from 'react-i18next';
import CartManager from '../components/cart/CartManager';

const { Title } = Typography;
const { Content } = Layout;

const CartPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Content style={{ padding: '20px' }}>
      <Title level={2}>{t('cart.title')}</Title>
      <CartManager />
    </Content>
  );
};

export default CartPage;
