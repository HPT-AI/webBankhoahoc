import React from 'react';
import { Layout, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const { Content, Footer } = Layout;
const { Title } = Typography;

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '50px 0'
      }}>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <Link to="/">
            <Title level={2}>{t('layout.appName')}</Title>
          </Link>
          <p>{t('layout.authDescription')}</p>
        </div>
        {children}
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        ©{new Date().getFullYear()} {t('layout.footerText')}
      </Footer>
    </Layout>
  );
};

export default AuthLayout;
