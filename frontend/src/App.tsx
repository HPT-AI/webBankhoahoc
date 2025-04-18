import { Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('home.title')}</h1>
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
