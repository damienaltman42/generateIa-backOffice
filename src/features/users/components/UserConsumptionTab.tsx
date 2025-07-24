import React from 'react';
import { Card, Col, Row, Statistic, Progress, Table, Typography, Space, Tag } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Line, Column, Gauge } from '@ant-design/plots';
import dayjs from 'dayjs';
import { useUserDetail, useUserConsumptionHistory } from '../hooks/useUserDetail';

const { Title, Text } = Typography;

interface UserConsumptionTabProps {
  userId: string;
}

export const UserConsumptionTab: React.FC<UserConsumptionTabProps> = ({ userId }) => {
  const { data: user } = useUserDetail(userId);
  const { data: history } = useUserConsumptionHistory(userId, {
    period: 'month',
    limit: 12,
  });

  if (!user) return null;

  // Calcul des métriques
  const totalLimit = 
    (user.effective_limits.articles || 0) +
    (user.effective_limits.social_posts || 0) +
    (user.effective_limits.stories || 0);

  const totalUsed = user.articles_used + user.social_posts_used + user.stories_used;
  const consumptionRate = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;

  // Calcul de la tendance (comparaison avec le mois dernier)
  const trend = history?.data?.[0]?.trend || 0;

  // Jours restants avant reset
  const daysUntilReset = user.subscription?.current_period_end
    ? dayjs(user.subscription.current_period_end).diff(dayjs(), 'day')
    : 30;

  // Score d'engagement (basé sur l'utilisation régulière)
  const engagementScore = Math.min(100, Math.round(consumptionRate * 1.2));

  // Configuration du graphique en ligne
  const lineConfig = {
    data: history?.data || [],
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    legend: {
      position: 'top-left' as const,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}`,
      },
    },
    tooltip: {
      formatter: (datum: { type: string; value: number }) => {
        return {
          name: datum.type,
          value: datum.value,
        };
      },
    },
  };

  // Configuration du graphique en barres
  const columnConfig = {
    data: history?.comparison || [],
    xField: 'period',
    yField: 'total',
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  // Configuration de la jauge
  const gaugeConfig = {
    percent: engagementScore / 100,
    range: {
      color: 'l(0) 0:#F4664A 0.5:#FAAD14 1:#30BF78',
    },
    startAngle: Math.PI,
    endAngle: 2 * Math.PI,
    indicator: null,
    statistic: {
      title: {
        offsetY: -36,
        style: {
          fontSize: '36px',
          color: '#4B535E',
        },
        formatter: () => `${engagementScore}`,
      },
      content: {
        style: {
          fontSize: '24px',
          lineHeight: '44px',
          color: '#4B535E',
        },
        formatter: () => 'Score',
      },
    },
  };

  const columns = [
    {
      title: 'Mois',
      dataIndex: 'month',
      key: 'month',
      render: (month: string) => dayjs(month).format('MMMM YYYY'),
    },
    {
      title: 'Articles',
      dataIndex: 'articles',
      key: 'articles',
      align: 'center' as const,
    },
    {
      title: 'Posts',
      dataIndex: 'social_posts',
      key: 'social_posts',
      align: 'center' as const,
    },
    {
      title: 'Stories',
      dataIndex: 'stories',
      key: 'stories',
      align: 'center' as const,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'center' as const,
      render: (total: number) => <Text strong>{total}</Text>,
    },
  ];

  return (
    <div>
      {/* Métriques principales */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Consommation ce mois"
              value={consumptionRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: consumptionRate > 80 ? '#cf1322' : '#3f8600' }}
              prefix={trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            />
            <Text type="secondary">
              {trend > 0 ? '+' : ''}{trend}% vs mois dernier
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Jours avant reset"
              value={daysUntilReset}
              suffix="jours"
              prefix={<CalendarOutlined />}
              valueStyle={{ color: daysUntilReset < 7 ? '#cf1322' : undefined }}
            />
            {daysUntilReset < 7 && (
              <Tag icon={<WarningOutlined />} color="warning">
                Bientôt épuisé
              </Tag>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total utilisé"
              value={totalUsed}
              suffix={`/ ${totalLimit}`}
            />
            <Progress 
              percent={consumptionRate} 
              size="small" 
              status={consumptionRate > 90 ? 'exception' : 'active'}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Title level={5} style={{ marginBottom: 16 }}>Score d'engagement</Title>
            <div style={{ height: 120 }}>
              <Gauge {...gaugeConfig} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Graphiques */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Évolution sur 12 mois">
            <div style={{ height: 300 }}>
              <Line {...lineConfig} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Comparaison périodes">
            <div style={{ height: 300 }}>
              <Column {...columnConfig} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tableau détaillé */}
      <Card title="Détail par mois" style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={history?.details || []}
          rowKey="month"
          pagination={false}
          size="small"
        />
      </Card>

      {/* Prévisions */}
      {consumptionRate > 70 && (
        <Card style={{ marginTop: 24 }}>
          <Space>
            <WarningOutlined style={{ color: '#faad14', fontSize: 20 }} />
            <div>
              <Title level={5} style={{ margin: 0 }}>
                Prévision d'épuisement
              </Title>
              <Text type="secondary">
                Au rythme actuel, les quotas seront épuisés dans environ {Math.round(daysUntilReset * (100 - consumptionRate) / consumptionRate)} jours.
              </Text>
            </div>
          </Space>
        </Card>
      )}
    </div>
  );
}; 