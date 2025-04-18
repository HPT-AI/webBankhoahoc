import React from 'react';
import { Layout, Menu, Badge } from 'antd';
import { ShoppingCartOutlined, HistoryOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../components/cart/CartManager';

const { Header, Content, Footer } = Layout;

const MainLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { cart } = useCart();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">{t('nav.home')}</Link>,
    },
    {
      key: '/cart',
      icon: (
        <Badge count={cart.items.length} size="small">
          <ShoppingCartOutlined style={{ fontSize: '16px' }} />
        </Badge>
      ),
      label: <Link to="/cart">{t('nav.cart')}</Link>,
    },
    {
      key: '/order-history',
      icon: <HistoryOutlined />,
      label: <Link to="/order-history">{t('nav.orderHistory')}</Link>,
    },
    {
      key: 'language',
      label: i18n.language === 'en' ? 'Tiếng Việt' : 'English',
      onClick: toggleLanguage,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', display: 'flex', alignItems: 'center' }}>
        <div className="logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginRight: '20px' }}>
          WebBankhoahoc
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 20 }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        WebBankhoahoc ©{new Date().getFullYear()} {t('footer.copyright')}
      </Footer>
    </Layout>
  );
};

export default MainLayout;
