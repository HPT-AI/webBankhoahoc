import React from 'react';
import { Card, Row, Col, Statistic, Progress, Alert, Spin } from 'antd';
import { useSystemHealth, useMetrics } from '../hooks/useMonitoring';
import { MetricType } from '../services/monitoring/MonitoringService';

const MonitoringDashboard: React.FC = () => {
  const { data: health, isLoading: isHealthLoading } = useSystemHealth();
  const { isLoading: isCpuLoading } = useMetrics(MetricType.CPU);
  const { isLoading: isMemoryLoading } = useMetrics(MetricType.MEMORY);
  const { isLoading: isDiskLoading } = useMetrics(MetricType.DISK);

  if (isHealthLoading || isCpuLoading || isMemoryLoading || isDiskLoading) {
    return <Spin size="large" />;
  }

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'Healthy':
        return 'success';
      case 'Degraded':
        return 'warning';
      case 'Unhealthy':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div>
      <h1>System Monitoring Dashboard</h1>
      
      {health && (
        <Alert
          message={`System Status: ${health.status}`}
          type={getStatusColor(health.status)}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      <Row gutter={16}>
        <Col span={8}>
          <Card title="CPU Usage">
            <Statistic
              value={health?.metrics?.cpuUsage || 0}
              precision={2}
              suffix="%"
            />
            <Progress
              percent={health?.metrics?.cpuUsage || 0}
              status={(health?.metrics?.cpuUsage || 0) > 80 ? 'exception' : 'normal'}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="Memory Usage">
            <Statistic
              value={health?.metrics?.memoryUsage || 0}
              precision={2}
              suffix="%"
            />
            <Progress
              percent={health?.metrics?.memoryUsage || 0}
              status={(health?.metrics?.memoryUsage || 0) > 80 ? 'exception' : 'normal'}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="Disk Usage">
            <Statistic
              value={health?.metrics?.diskUsage || 0}
              precision={2}
              suffix="%"
            />
            <Progress
              percent={health?.metrics?.diskUsage || 0}
              status={(health?.metrics?.diskUsage || 0) > 80 ? 'exception' : 'normal'}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card title="Active Connections">
            <Statistic
              value={health?.metrics?.activeConnections || 0}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="Response Time">
            <Statistic
              value={health?.metrics?.responseTime || 0}
              suffix="ms"
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="Error Rate">
            <Statistic
              value={health?.metrics?.errorRate || 0}
              suffix="/min"
            />
          </Card>
        </Col>
      </Row>
      
      {health?.issues && health.issues.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h2>Current Issues</h2>
          {health.issues.map((issue, index) => (
            <Alert
              key={index}
              message={issue}
              type="warning"
              showIcon
              style={{ marginBottom: 8 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MonitoringDashboard;
