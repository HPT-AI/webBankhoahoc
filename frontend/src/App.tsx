import { Button, Space, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import MonitoringDashboard from './components/MonitoringDashboard';

function App() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('home.title')}</h1>
      <Space style={{ marginBottom: '20px' }}>
        <Button type="primary">{t('home.startLearning')}</Button>
        <Button onClick={toggleLanguage}>
          {i18n.language === 'en' ? 'Tiếng Việt' : 'English'}
        </Button>
      </Space>
      
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: 'Home',
            children: <div>Home Content</div>,
          },
          {
            key: '2',
            label: 'Monitoring',
            children: <MonitoringDashboard />,
          },
        ]}
      />
    </div>
  );
}

export default App;
