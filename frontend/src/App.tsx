import { Button, Space, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  DashboardOutlined, 
  BarChartOutlined, 
  FileExcelOutlined
} from '@ant-design/icons';

function App() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('home.title')}</h1>
      <Menu mode="horizontal" style={{ marginBottom: 20 }}>
        <Menu.Item key="home" icon={<DashboardOutlined />}>
          <Link to="/">{t('home.home')}</Link>
        </Menu.Item>
        <Menu.Item key="revenue" icon={<BarChartOutlined />}>
          <Link to="/analytics/revenue">{t('analytics.revenueDashboard')}</Link>
        </Menu.Item>
        <Menu.Item key="commission" icon={<FileExcelOutlined />}>
          <Link to="/analytics/commission">{t('analytics.commissionReports')}</Link>
        </Menu.Item>
        <Menu.Item key="export" icon={<FileExcelOutlined />}>
          <Link to="/analytics/export">{t('analytics.exportReports')}</Link>
        </Menu.Item>
      </Menu>
      <Space>
        <Button type="primary">{t('home.startLearning')}</Button>
        <Button onClick={toggleLanguage}>
          {i18n.language === 'en' ? 'Tiếng Việt' : 'English'}
        </Button>
      </Space>
    </div>
  );
}

export default App;
