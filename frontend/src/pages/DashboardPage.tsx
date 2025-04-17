import React from 'react';
import { Typography, Card, Row, Col, Statistic, Button } from 'antd';
import { BookOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

const { Title, Paragraph } = Typography;

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Title level={2}>{t('dashboard.welcome', { name: user?.name })}</Title>
      <Paragraph>{t('dashboard.description')}</Paragraph>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title={t('dashboard.enrolledCourses')} 
              value={5} 
              prefix={<BookOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title={t('dashboard.completedLessons')} 
              value={12} 
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title={t('dashboard.achievements')} 
              value={3} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      <Card title={t('dashboard.recentCourses')} style={{ marginTop: '24px' }}>
        <p>{t('dashboard.noCourses')}</p>
        <Button type="primary">{t('dashboard.browseCourses')}</Button>
      </Card>
    </div>
  );
};

export default DashboardPage;
