import React from 'react';
import { Row, Col, Card, Statistic, Progress, Skeleton, Alert } from 'antd';
import { UserOutlined, CheckCircleOutlined, SwapOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useWhitelistStats } from '../hooks/useWhitelistData';

export const WhitelistStats: React.FC = () => {
  const { data: stats, isLoading, error } = useWhitelistStats();

  if (error) {
    return (
      <Alert
        message="Erreur de chargement"
        description="Impossible de charger les statistiques de la whitelist"
        type="error"
        showIcon
      />
    );
  }

  if (isLoading || !stats) {
    return (
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4].map((i) => (
          <Col xs={24} sm={12} md={6} key={i}>
            <Card>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Total inscriptions"
            value={stats.total}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Emails confirmés"
            value={stats.confirmed}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
          <Progress 
            percent={Math.round(stats.confirmationRate * 10) / 10} 
            size="small" 
            strokeColor="#52c41a"
            format={(percent) => `${percent}%`}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Utilisateurs migrés"
            value={stats.migrated}
            prefix={<SwapOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
          <Progress 
            percent={Math.round(stats.migrationRate * 10) / 10} 
            size="small" 
            strokeColor="#722ed1"
            format={(percent) => `${percent}%`}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="En attente de migration"
            value={stats.pending}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#fa8c16' }}
          />
        </Card>
      </Col>
    </Row>
  );
}; 