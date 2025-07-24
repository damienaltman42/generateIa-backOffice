import React from 'react';
import { Card, Space, Typography, Button, Divider } from 'antd';
import { DownloadOutlined, SwapOutlined } from '@ant-design/icons';
import { WhitelistStats } from '../components/WhitelistStats';
import { WhitelistTable } from '../components/WhitelistTable';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

const { Title, Text } = Typography;

export const WhitelistManagementPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div style={{ padding: isMobile ? '16px' : '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Gestion de la Whitelist</Title>
        <Text type="secondary">
          Gérez les inscriptions à la liste d'attente et migrez les utilisateurs vers des comptes actifs
        </Text>
      </div>

      {/* Statistiques */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>
          Statistiques
        </Title>
        <WhitelistStats />
      </Card>

      {/* Actions rapides */}
      <Card style={{ marginBottom: '24px' }}>
        <Space 
          wrap 
          style={{ 
            width: '100%', 
            justifyContent: isMobile ? 'center' : 'flex-start' 
          }}
        >
          <Button 
            type="primary" 
            icon={<SwapOutlined />}
            size={isMobile ? 'small' : 'middle'}
          >
            Migration en lot
          </Button>
          <Button 
            icon={<DownloadOutlined />}
            size={isMobile ? 'small' : 'middle'}
          >
            Exporter CSV
          </Button>
        </Space>
      </Card>

      <Divider />

      {/* Table des utilisateurs */}
      <Card>
        <Title level={4} style={{ marginBottom: '16px' }}>
          Liste des inscriptions
        </Title>
        <WhitelistTable />
      </Card>
    </div>
  );
}; 