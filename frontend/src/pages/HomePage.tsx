import React from 'react';
import { Typography, Layout, Button, Space, Card, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCart } from '../components/cart/CartManager';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const mockCourses = [
  {
    courseId: 'course-1',
    title: 'Introduction to React',
    price: 49.99,
    instructor: 'John Doe',
    description: 'Learn the fundamentals of React and build modern web applications.'
  },
  {
    courseId: 'course-2',
    title: 'Advanced TypeScript',
    price: 69.99,
    instructor: 'Jane Smith',
    description: 'Master TypeScript and build type-safe applications.'
  },
  {
    courseId: 'course-3',
    title: 'Node.js Fundamentals',
    price: 59.99,
    instructor: 'Bob Johnson',
    description: 'Build server-side applications with Node.js and Express.'
  },
  {
    courseId: 'course-4',
    title: 'Data Structures and Algorithms',
    price: 79.99,
    instructor: 'Alice Williams',
    description: 'Learn essential computer science concepts for technical interviews.'
  }
];

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { addItem } = useCart();

  return (
    <Content style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title>{t('home.title')}</Title>
        <Paragraph>{t('home.subtitle')}</Paragraph>
      </div>

      <Title level={2}>{t('home.featuredCourses')}</Title>
      <Row gutter={[16, 16]}>
        {mockCourses.map(course => (
          <Col xs={24} sm={12} md={8} lg={6} key={course.courseId}>
            <Card
              hoverable
              cover={
                <div style={{ 
                  height: '160px', 
                  background: `hsl(${Math.random() * 360}, 70%, 75%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Title level={4} style={{ color: 'white' }}>{course.title}</Title>
                </div>
              }
              actions={[
                <Button 
                  type="primary" 
                  onClick={() => addItem(course)}
                  key="add"
                >
                  {t('home.addToCart')}
                </Button>
              ]}
            >
              <Card.Meta
                title={course.title}
                description={
                  <Space direction="vertical">
                    <Paragraph>{course.description}</Paragraph>
                    <Paragraph strong>{t('home.instructor')}: {course.instructor}</Paragraph>
                    <Paragraph strong>${course.price.toFixed(2)}</Paragraph>
                  </Space>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Content>
  );
};

export default HomePage;
