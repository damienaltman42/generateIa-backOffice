import React from 'react';
import { Card, Descriptions, Tag, Space, Typography, Badge } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import type { User } from '../types/users.types';

dayjs.extend(relativeTime);
dayjs.locale('fr');

const { Title, Text } = Typography;

interface UserProfileTabProps {
  user: User;
}

export const UserProfileTab: React.FC<UserProfileTabProps> = ({ user }) => {
  const renderPlanLimits = () => {
    if (!user.effective_limits) return null;

    return (
      <Card size="small" style={{ marginTop: 16 }}>
        <Title level={5}>Limites du plan</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text type="secondary">Articles: </Text>
            <Text strong>{user.effective_limits.articles || 0}</Text>
          </div>
          <div>
            <Text type="secondary">Posts sociaux: </Text>
            <Text strong>{user.effective_limits.social_posts || 0}</Text>
          </div>
          <div>
            <Text type="secondary">Stories: </Text>
            <Text strong>{user.effective_limits.stories || 0}</Text>
          </div>
        </Space>
      </Card>
    );
  };

  const renderAdditionalCredits = () => {
    const hasAdditionalCredits = 
      user.additional_articles > 0 ||
      user.additional_social_posts > 0 ||
      user.additional_stories > 0;

    if (!hasAdditionalCredits) return null;

    return (
      <Card size="small" style={{ marginTop: 16 }}>
        <Title level={5}>Crédits supplémentaires</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          {user.additional_articles > 0 && (
            <div>
              <Text type="secondary">Articles: </Text>
              <Text strong type="success">+{user.additional_articles}</Text>
            </div>
          )}
          {user.additional_social_posts > 0 && (
            <div>
              <Text type="secondary">Posts sociaux: </Text>
              <Text strong type="success">+{user.additional_social_posts}</Text>
            </div>
          )}
          {user.additional_stories > 0 && (
            <div>
              <Text type="secondary">Stories: </Text>
              <Text strong type="success">+{user.additional_stories}</Text>
            </div>
          )}
        </Space>
      </Card>
    );
  };

  return (
    <div>
      <Descriptions 
        bordered 
        column={{ xs: 1, sm: 2, md: 2 }}
        labelStyle={{ fontWeight: 500 }}
      >
        <Descriptions.Item label="Email">
          <Space>
            {user.email}
            {user.emailVerified && (
              <Badge 
                count={<CheckCircleOutlined style={{ color: '#52c41a' }} />} 
                title="Email vérifié"
              />
            )}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Nom complet">
          {user.name || <Text type="secondary">Non renseigné</Text>}
        </Descriptions.Item>

        <Descriptions.Item label="Entreprise">
          {user.company || <Text type="secondary">Non renseigné</Text>}
        </Descriptions.Item>

        <Descriptions.Item label="Rôle">
          <Space>
            {user.isAdmin ? (
              <Tag icon={<CrownOutlined />} color="gold">Admin</Tag>
            ) : (
              <Tag icon={<UserOutlined />}>Utilisateur</Tag>
            )}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Date d'inscription">
          <Space direction="vertical" size={0}>
            <Text>{dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dayjs(user.createdAt).fromNow()}
            </Text>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Dernière connexion">
          {user.lastLoginAt ? (
            <Space direction="vertical" size={0}>
              <Text>{dayjs(user.lastLoginAt).format('DD/MM/YYYY HH:mm')}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {dayjs(user.lastLoginAt).fromNow()}
              </Text>
            </Space>
          ) : (
            <Text type="secondary">Jamais connecté</Text>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Plan actuel" span={2}>
          <Space>
            <Tag color={user.plan?.name === 'Pro' ? 'blue' : 'default'}>
              {user.plan?.name || 'Aucun'}
            </Tag>
            {user.subscription?.status === 'active' && (
              <Tag icon={<CheckCircleOutlined />} color="success">
                Actif
              </Tag>
            )}
            {user.subscription?.status === 'trial' && (
              <Tag icon={<ClockCircleOutlined />} color="processing">
                Période d'essai
              </Tag>
            )}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Statut du compte">
          <Tag color={user.status === 'active' ? 'success' : 'error'}>
            {user.status === 'active' ? 'Actif' : 'Suspendu'}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="ID utilisateur">
          <Text code copyable>{user.id}</Text>
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          {renderPlanLimits()}
        </div>
        <div>
          {renderAdditionalCredits()}
        </div>
      </div>
    </div>
  );
}; 