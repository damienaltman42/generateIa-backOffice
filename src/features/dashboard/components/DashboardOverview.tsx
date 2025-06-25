import React, { useState } from 'react';
import { Row, Col, Card, Space, Button, Alert, Spin, Typography, Statistic, Progress } from 'antd';
import { 
  UserOutlined, 
  DollarOutlined, 
  FileTextOutlined, 
  ShareAltOutlined,
  CloudServerOutlined,
  ReloadOutlined,
  TeamOutlined,
  RiseOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Line, Column, DualAxes } from '@ant-design/charts';
import { MetricCard } from './MetricCard';
import { PeriodSelector } from './PeriodSelector';
import { dashboardApi } from '../api/dashboardApi';
import type { DashboardPeriod } from '../types/dashboard.types';

const { Title } = Typography;

export const DashboardOverview: React.FC = () => {
  const [period, setPeriod] = useState<DashboardPeriod>('30d');
  const [compare, setCompare] = useState(false);

  const { data: overview, isLoading: overviewLoading, refetch: refetchOverview } = useQuery({
    queryKey: ['dashboard-overview', period, compare],
    queryFn: () => dashboardApi.getOverview(period, compare),
  });

  const { data: userDetails, isLoading: userDetailsLoading } = useQuery({
    queryKey: ['dashboard-users', period],
    queryFn: () => dashboardApi.getUsersMetrics(period),
  });

  const { data: financialDetails, isLoading: financialDetailsLoading } = useQuery({
    queryKey: ['dashboard-financial', period],
    queryFn: () => dashboardApi.getFinancialMetrics(period),
  });

  const { data: usageDetails, isLoading: usageDetailsLoading } = useQuery({
    queryKey: ['dashboard-usage', period],
    queryFn: () => dashboardApi.getUsageMetrics(period),
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: () => dashboardApi.getAlerts(),
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });

  const handleRefresh = () => {
    refetchOverview();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const isLoading = overviewLoading || userDetailsLoading || financialDetailsLoading || usageDetailsLoading;

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Tableau de bord</Title>
        </Col>
        <Col>
          <Space>
            <PeriodSelector
              period={period}
              onPeriodChange={setPeriod}
              compare={compare}
              onCompareChange={setCompare}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={overviewLoading}
            >
              Rafraîchir
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Alertes */}
      {!alertsLoading && alerts && alerts.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {alerts.map((alert, index) => (
                <Alert
                  key={index}
                  message={alert.title}
                  description={alert.message}
                  type={alert.type}
                  showIcon
                  closable
                  action={
                    alert.link && (
                      <Button size="small" type="link" href={alert.link}>
                        Voir détails
                      </Button>
                    )
                  }
                />
              ))}
            </Space>
          </Col>
        </Row>
      )}

      {/* KPIs principaux */}
      <Spin spinning={isLoading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {/* Métriques utilisateurs */}
          <Col xs={24} sm={12} md={6}>
            <MetricCard
              title="Utilisateurs actifs (30j)"
              value={overview?.metrics.users.active30d || 0}
              prefix={<UserOutlined />}
              info="Utilisateurs ayant généré du contenu dans les 30 derniers jours"
              link="/users"
              loading={overviewLoading}
            />
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <MetricCard
              title="Nouveaux utilisateurs"
              value={overview?.metrics.users.newUsers || 0}
              prefix={<TeamOutlined />}
              trend={compare ? overview?.metrics.users.comparison?.newUsers : undefined}
              trendLabel={compare ? "vs période précédente" : undefined}
              link="/users?filter=new"
              loading={overviewLoading}
            />
          </Col>

          {/* Métriques financières */}
          <Col xs={24} sm={12} md={6}>
            <MetricCard
              title="MRR"
              value={overview?.metrics.financial.mrr || 0}
              formatter={(val) => formatCurrency(Number(val))}
              prefix={<DollarOutlined />}
              trend={compare ? overview?.metrics.financial.comparison?.mrr : undefined}
              trendLabel={compare ? "vs période précédente" : undefined}
              info="Monthly Recurring Revenue"
              link="/subscriptions"
              loading={overviewLoading}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <MetricCard
              title="Taux de churn"
              value={overview?.metrics.financial.churnRate || 0}
              suffix="%"
              precision={1}
              prefix={<PercentageOutlined />}
              trend={compare ? overview?.metrics.financial.comparison?.churnRate : undefined}
              trendLabel={compare ? "vs période précédente" : undefined}
              info="Pourcentage d'abonnements annulés"
              link="/subscriptions?status=cancelled"
              loading={overviewLoading}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {/* Métriques d'usage */}
          <Col xs={24} sm={12} md={6}>
            <MetricCard
              title="Articles générés"
              value={overview?.metrics.usage.articles || 0}
              prefix={<FileTextOutlined />}
              trend={compare ? overview?.metrics.usage.comparison?.articles : undefined}
              trendLabel={compare ? "vs période précédente" : undefined}
              loading={overviewLoading}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <MetricCard
              title="Posts sociaux"
              value={overview?.metrics.usage.socialPosts || 0}
              prefix={<ShareAltOutlined />}
              trend={compare ? overview?.metrics.usage.comparison?.socialPosts : undefined}
              trendLabel={compare ? "vs période précédente" : undefined}
              loading={overviewLoading}
            />
          </Col>

          {/* Métriques système */}
          <Col xs={24} sm={12} md={6}>
            <MetricCard
              title="Jobs en attente"
              value={overview?.metrics.system.jobs.waiting || 0}
              prefix={<CloudServerOutlined />}
              info="Tâches en file d'attente"
              link="/jobs?status=waiting"
              loading={overviewLoading}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <MetricCard
              title="Jobs échoués"
              value={overview?.metrics.system.jobs.failed || 0}
              prefix={<CloudServerOutlined />}
              info="Tâches ayant échoué"
              link="/jobs?status=failed"
              loading={overviewLoading}
            />
          </Col>
        </Row>

        {/* Graphiques */}
        <Row gutter={[16, 16]}>
          {/* Évolution des utilisateurs */}
          <Col xs={24} lg={12}>
            <Card title="Évolution des utilisateurs" loading={userDetailsLoading}>
              {userDetails?.charts.userGrowth && userDetails.charts.userGrowth.length > 0 && (
                <Line
                  data={userDetails.charts.userGrowth}
                  xField="date"
                  yField="users"
                  height={300}
                  smooth
                  point={{
                    size: 3,
                    shape: 'circle',
                  }}
                  tooltip={false}
                  xAxis={{
                    type: 'cat',
                    label: {
                      rotate: -45,
                      style: {
                        fontSize: 10,
                      },
                    },
                  }}
                  yAxis={{
                    min: 0,
                    label: {
                      formatter: (v: string) => `${v}`,
                    },
                  }}
                />
              )}
            </Card>
          </Col>

          {/* Évolution du MRR */}
          <Col xs={24} lg={12}>
            <Card title="Évolution du MRR" loading={financialDetailsLoading}>
              {financialDetails?.charts.mrrEvolution && (
                <Column
                  data={financialDetails.charts.mrrEvolution}
                  xField="date"
                  yField="mrr"
                  height={300}
                  columnStyle={{
                    radius: [8, 8, 0, 0],
                  }}
                  tooltip={{
                    formatter: (datum: {mrr: number}) => ({
                      name: 'MRR',
                      value: formatCurrency(datum.mrr),
                    }),
                  }}
                />
              )}
            </Card>
          </Col>

          {/* Timeline d'usage */}
          <Col xs={24} lg={12}>
            <Card title="Contenu généré" loading={usageDetailsLoading}>
              {usageDetails?.charts.usageTimeline && (
                <DualAxes
                  data={[
                    usageDetails.charts.usageTimeline,
                    usageDetails.charts.usageTimeline,
                  ]}
                  xField="date"
                  yField={['articles', 'socialPosts']}
                  height={300}
                  geometryOptions={[
                    {
                      geometry: 'column',
                      color: '#5B8FF9',
                    },
                    {
                      geometry: 'line',
                      color: '#5AD8A6',
                      lineStyle: {
                        lineWidth: 2,
                      },
                    },
                  ]}
                  legend={{
                    custom: true,
                    items: [
                      { name: 'Articles', value: 'articles', marker: { symbol: 'square', style: { fill: '#5B8FF9' } } },
                      { name: 'Posts sociaux', value: 'socialPosts', marker: { symbol: 'line', style: { stroke: '#5AD8A6' } } },
                    ],
                  }}
                />
              )}
            </Card>
          </Col>

          {/* Jauge d'utilisation des quotas */}
          <Col xs={24} lg={12}>
            <Card title="Utilisation des quotas" loading={usageDetailsLoading}>
              {!usageDetailsLoading && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <Progress
                    type="dashboard"
                    percent={Math.round(overview?.metrics.usage.quotaUsage || 0)}
                    size={240}
                    strokeColor={{
                      '0%': '#30BF78',
                      '50%': '#FAAD14',
                      '100%': '#F4664A',
                    }}
                    format={(percent: number | undefined) => (
                      <div>
                        <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{percent || 0}%</div>
                        <div style={{ fontSize: '14px', color: '#8c8c8c' }}>Utilisation</div>
                      </div>
                    )}
                  />
                  <div style={{ marginTop: '20px' }}>
                    <Space direction="vertical" size="small">
                      <span style={{ color: '#8c8c8c' }}>
                        Basé sur l'utilisation moyenne des quotas
                      </span>
                      {overview?.metrics.usage.quotaUsage !== undefined && (
                        <span style={{ 
                          color: overview.metrics.usage.quotaUsage > 80 ? '#ff4d4f' : 
                                 overview.metrics.usage.quotaUsage > 50 ? '#faad14' : '#52c41a'
                        }}>
                          {overview.metrics.usage.quotaUsage > 80 ? 'Utilisation élevée' :
                           overview.metrics.usage.quotaUsage > 50 ? 'Utilisation modérée' : 'Utilisation normale'}
                        </span>
                      )}
                    </Space>
                  </div>
                </div>
              )}
            </Card>
          </Col>

          {/* Statistiques additionnelles */}
          <Col xs={24}>
            <Card title="Statistiques détaillées">
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="ARPU"
                    value={overview?.metrics.financial.arpu || 0}
                    formatter={(val) => formatCurrency(Number(val))}
                    prefix={<RiseOutlined />}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Taux de conversion"
                    value={userDetails?.conversionRate || 0}
                    suffix="%"
                    precision={1}
                    prefix={<PercentageOutlined />}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Total utilisateurs"
                    value={userDetails?.totalUsers || 0}
                    prefix={<TeamOutlined />}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Utilisateurs Pro"
                    value={userDetails?.proUsers || 0}
                    prefix={<UserOutlined />}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}; 