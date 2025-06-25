import React from 'react';
import { Card, Descriptions, Tag, Space, Button, Typography, Statistic, Row, Col, Empty } from 'antd';
import {
  CreditCardOutlined,
  DollarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useUserDetail } from '../hooks/useUserDetail';

const { Text } = Typography;

interface UserBillingTabProps {
  userId: string;
}

export const UserBillingTab: React.FC<UserBillingTabProps> = ({ userId }) => {
  const { data: user } = useUserDetail(userId);

  if (!user) return null;

  const subscription = user.subscription;
  const plan = user.plan;

  // Calcul de la Lifetime Value (LTV) - simulation
  const ltv = 0; // Pour l'instant, pas de données de paiement dans l'API

  const renderSubscriptionInfo = () => {
    if (!subscription || subscription.status === 'inactive') {
      return (
        <Card>
          <Empty description="Aucun abonnement actif" />
        </Card>
      );
    }

    return (
      <Card title="Abonnement actuel">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Plan">
            <Space>
              <Tag color="blue">{plan?.name || 'Free'}</Tag>
              <Text strong>{plan?.monthly_price || 0} €/mois</Text>
            </Space>
          </Descriptions.Item>
          
          <Descriptions.Item label="Statut">
            <Tag 
              color={subscription.status === 'active' ? 'success' : 'warning'}
              icon={subscription.status === 'active' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            >
              {subscription.status === 'active' ? 'Actif' : 'Période d\'essai'}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Date de début">
            {dayjs(subscription.current_period_start).format('DD/MM/YYYY')}
          </Descriptions.Item>
          
          <Descriptions.Item label="Prochaine facturation">
            <Space direction="vertical" size={0}>
              <Text>{dayjs(subscription.current_period_end).format('DD/MM/YYYY')}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Dans {dayjs(subscription.current_period_end).diff(dayjs(), 'day')} jours
              </Text>
            </Space>
          </Descriptions.Item>
          
          <Descriptions.Item label="Méthode de paiement">
            <Space>
              <CreditCardOutlined />
              <Text>Carte bancaire</Text>
            </Space>
          </Descriptions.Item>
          
          {subscription.canceled_at && (
            <Descriptions.Item label="Annulation">
              <Tag color="warning">
                Annulé - Se termine le {dayjs(subscription.current_period_end).format('DD/MM/YYYY')}
              </Tag>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    );
  };

  return (
    <div>
      {/* Métriques */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Lifetime Value"
              value={ltv}
              precision={2}
              suffix="€"
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Paiements totaux"
              value={0}
              prefix={<CreditCardOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Durée d'abonnement"
              value={
                subscription?.current_period_start
                  ? dayjs().diff(dayjs(subscription.current_period_start), 'month')
                  : 0
              }
              suffix="mois"
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Informations d'abonnement */}
      {renderSubscriptionInfo()}

      {/* Historique des paiements */}
      <Card title="Historique des paiements" style={{ marginTop: 24 }}>
        <Empty description="Aucun paiement enregistré" />
      </Card>

      {/* Actions */}
      <Card title="Actions" style={{ marginTop: 24 }}>
        <Space wrap>
          <Button icon={<CreditCardOutlined />}>
            Mettre à jour la méthode de paiement
          </Button>
          <Button icon={<SyncOutlined />}>
            Changer de plan
          </Button>
          {subscription?.status === 'active' && !subscription?.canceled_at && (
            <Button danger>
              Annuler l'abonnement
            </Button>
          )}
        </Space>
      </Card>
    </div>
  );
}; 