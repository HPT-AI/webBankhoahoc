import React from 'react';
import { Layout, Button, Dropdown } from 'antd';
import { UserOutlined, GlobalOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

const { Header, Content, Footer } = Layout;

const MainLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: t('layout.profile'),
      icon: <UserOutlined />,
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'logout',
      label: t('layout.logout'),
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="logo" style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          <Link to="/" style={{ color: 'white' }}>
            {t('layout.appName')}
          </Link>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button 
            icon={<GlobalOutlined />} 
            onClick={toggleLanguage}
            type="text" 
            style={{ color: 'white' }}
          >
            {i18n.language === 'en' ? 'VI' : 'EN'}
          </Button>
          
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" icon={<UserOutlined />} style={{ color: 'white' }}>
                {user?.name}
              </Button>
            </Dropdown>
          ) : (
            <Button 
              type="primary" 
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
            >
              {t('layout.login')}
            </Button>
          )}
        </div>
      </Header>
      
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <Outlet />
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        ©{new Date().getFullYear()} {t('layout.footerText')}
      </Footer>
    </Layout>
  );
};

export default MainLayout;
