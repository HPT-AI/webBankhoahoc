import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Typography, Space, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { OrderHistoryItem } from '../../types/cart';

const { Title, Text } = Typography;

const OrderHistory: React.FC = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const mockOrders: OrderHistoryItem[] = [
          {
            orderId: 'ORD-1234567890',
            date: '2025-04-15T10:30:00Z',
            courses: [
              {
                courseId: 'course-1',
                title: 'Introduction to React',
                price: 49.99,
                instructor: 'John Doe'
              },
              {
                courseId: 'course-2',
                title: 'Advanced TypeScript',
                price: 69.99,
                instructor: 'Jane Smith'
              }
            ],
            total: 119.98,
            status: 'completed',
            paymentMethod: 'STRIPE'
          },
          {
            orderId: 'ORD-0987654321',
            date: '2025-04-10T14:15:00Z',
            courses: [
              {
                courseId: 'course-3',
                title: 'Node.js Fundamentals',
                price: 59.99,
                instructor: 'Bob Johnson'
              }
            ],
            total: 59.99,
            status: 'completed',
            paymentMethod: 'VNPAY'
          },
          {
            orderId: 'ORD-5678901234',
            date: '2025-04-05T09:45:00Z',
            courses: [
              {
                courseId: 'course-4',
                title: 'Data Structures and Algorithms',
                price: 79.99,
                instructor: 'Alice Williams'
              }
            ],
            total: 79.99,
            status: 'processing',
            paymentMethod: 'STRIPE'
          }
        ];

        setTimeout(() => {
          setOrders(mockOrders);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      title: t('orderHistory.orderId'),
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: t('orderHistory.date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('orderHistory.courses'),
      dataIndex: 'courses',
      key: 'courses',
      render: (courses: OrderHistoryItem['courses']) => (
        <span>{courses.length} {courses.length === 1 ? t('orderHistory.course') : t('orderHistory.courses')}</span>
      ),
    },
    {
      title: t('orderHistory.total'),
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: t('orderHistory.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        if (status === 'processing') {
          color = 'blue';
        } else if (status === 'failed') {
          color = 'red';
        }
        return (
          <Tag color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: t('orderHistory.paymentMethod'),
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: t('orderHistory.actions'),
      key: 'actions',
      render: (_: unknown, record: OrderHistoryItem) => (
        <Space size="middle">
          <Button type="link" onClick={() => viewOrderDetails(record.orderId)}>
            {t('orderHistory.viewDetails')}
          </Button>
        </Space>
      ),
    },
  ];

  const viewOrderDetails = (orderId: string) => {
    console.log(`View details for order ${orderId}`);
  };

  const expandedRowRender = (record: OrderHistoryItem) => {
    const courseColumns = [
      {
        title: t('orderHistory.courseTitle'),
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: t('orderHistory.instructor'),
        dataIndex: 'instructor',
        key: 'instructor',
      },
      {
        title: t('orderHistory.price'),
        dataIndex: 'price',
        key: 'price',
        render: (price: number) => `$${price.toFixed(2)}`,
      },
    ];

    return (
      <Card>
        <Title level={5}>{t('orderHistory.orderDetails')}</Title>
        <Text>{t('orderHistory.orderDate')}: {new Date(record.date).toLocaleString()}</Text>
        <Table
          columns={courseColumns}
          dataSource={record.courses}
          pagination={false}
          rowKey="courseId"
        />
      </Card>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>{t('orderHistory.title')}</Title>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="orderId"
        loading={loading}
        expandable={{ expandedRowRender }}
      />
    </div>
  );
};

export default OrderHistory;
