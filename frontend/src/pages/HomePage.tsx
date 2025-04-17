import React from 'react';
import { Button, Typography, Space, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Title level={1}>{t('home.title')}</Title>
      <Paragraph>{t('home.startLearning')}</Paragraph>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title={t('home.featuredCourses')} style={{ width: '100%' }}>
          <p>{t('home.coursesDescription')}</p>
          <Link to="/dashboard">
            <Button type="primary">{t('home.exploreCourses')}</Button>
          </Link>
        </Card>
      </Space>
    </div>
  );
};

export default HomePage;
