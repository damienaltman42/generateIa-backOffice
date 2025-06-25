import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  Card,
  Dropdown,
  Space,
  Tabs,
  Typography,
  message,
  Drawer,
  Collapse,
  Grid,
} from 'antd';
import {
  ArrowLeftOutlined,
  MoreOutlined,
  UserSwitchOutlined,
  PlusCircleOutlined,
  StopOutlined,
  LockOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useUserDetail } from '../hooks/useUserDetail';
import { useUserActions } from '../hooks/useUserActions';
import { UserStatusBadge } from '../components/UserStatusBadge';
import { UpdateRightsModal } from '../components/UpdateRightsModal';
import { UpdateQuotasModal } from '../components/UpdateQuotasModal';
import { SuspendUserModal } from '../components/SuspendUserModal';
import { ResetPasswordModal } from '../components/ResetPasswordModal';
import { UserDetailSkeleton, TabContentSkeleton } from '../components/UserDetailSkeleton';
import type { MenuProps } from 'antd';

const { Title } = Typography;
const { useBreakpoint } = Grid;
const { Panel } = Collapse;

// Lazy loading des composants d'onglets
const UserProfileTab = lazy(() => import('../components/UserProfileTab').then(module => ({ default: module.UserProfileTab })));
const UserConsumptionTab = lazy(() => import('../components/UserConsumptionTab').then(module => ({ default: module.UserConsumptionTab })));
const UserHistoryTab = lazy(() => import('../components/UserHistoryTab').then(module => ({ default: module.UserHistoryTab })));
const UserResourcesTab = lazy(() => import('../components/UserResourcesTab').then(module => ({ default: module.UserResourcesTab })));
const UserBillingTab = lazy(() => import('../components/UserBillingTab').then(module => ({ default: module.UserBillingTab })));

export const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { data: user, isLoading, error, refetch } = useUserDetail(userId || '');
  
  const [activeTab, setActiveTab] = useState('profile');
  const [rightsModalOpen, setRightsModalOpen] = useState(false);
  const [quotasModalOpen, setQuotasModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

  // Recharger les données quand l'userId change
  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  // Callbacks pour fermer les modales après succès
  const handleModalSuccess = (modalSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    return () => {
      modalSetter(false);
      // Force le rafraîchissement des données
      setTimeout(() => {
        refetch();
      }, 100);
    };
  };

  const actions = useUserActions(userId || '', {
    onSuccess: () => {
      // Les modales seront fermées par les callbacks spécifiques
    }
  });

  if (isLoading) {
    return <UserDetailSkeleton />;
  }

  if (error || !user) {
    message.error('Erreur lors du chargement de l\'utilisateur');
    navigate('/users');
    return null;
  }

  const actionItems: MenuProps['items'] = [
    {
      key: 'rights',
      label: 'Modifier droits',
      icon: <UserSwitchOutlined />,
      danger: user.isAdmin,
      onClick: () => setRightsModalOpen(true),
    },
    {
      key: 'quotas',
      label: 'Ajouter crédits',
      icon: <PlusCircleOutlined />,
      onClick: () => setQuotasModalOpen(true),
    },
    {
      key: 'suspend',
      label: user.status === 'suspended' ? 'Réactiver' : 'Suspendre',
      icon: user.status === 'suspended' ? <CheckCircleOutlined /> : <StopOutlined />,
      danger: user.status !== 'suspended',
      onClick: () => setSuspendModalOpen(true),
    },
    {
      key: 'reset-password',
      label: 'Réinitialiser mot de passe',
      icon: <LockOutlined />,
      onClick: () => setResetPasswordModalOpen(true),
    },
  ];

  // Actions pour le drawer mobile
  const mobileActions = [
    {
      key: 'rights',
      label: 'Modifier droits',
      icon: <UserSwitchOutlined />,
      danger: user.isAdmin,
      onClick: () => setRightsModalOpen(true),
    },
    {
      key: 'quotas',
      label: 'Ajouter crédits',
      icon: <PlusCircleOutlined />,
      onClick: () => setQuotasModalOpen(true),
    },
    {
      key: 'suspend',
      label: user.status === 'suspended' ? 'Réactiver' : 'Suspendre',
      icon: user.status === 'suspended' ? <CheckCircleOutlined /> : <StopOutlined />,
      danger: user.status !== 'suspended',
      onClick: () => setSuspendModalOpen(true),
    },
    {
      key: 'reset-password',
      label: 'Réinitialiser mot de passe',
      icon: <LockOutlined />,
      onClick: () => setResetPasswordModalOpen(true),
    },
  ];

  const tabItems = [
    {
      key: 'profile',
      label: 'Profil',
      children: (
        <Suspense fallback={<TabContentSkeleton />}>
          <UserProfileTab user={user} />
        </Suspense>
      ),
    },
    {
      key: 'consumption',
      label: 'Consommation',
      children: (
        <Suspense fallback={<TabContentSkeleton />}>
          <UserConsumptionTab userId={user.id} />
        </Suspense>
      ),
    },
    {
      key: 'history',
      label: 'Historique',
      children: (
        <Suspense fallback={<TabContentSkeleton />}>
          <UserHistoryTab userId={user.id} />
        </Suspense>
      ),
    },
    {
      key: 'resources',
      label: 'Ressources',
      children: (
        <Suspense fallback={<TabContentSkeleton />}>
          <UserResourcesTab userId={user.id} />
        </Suspense>
      ),
    },
    {
      key: 'billing',
      label: 'Facturation',
      children: (
        <Suspense fallback={<TabContentSkeleton />}>
          <UserBillingTab userId={user.id} />
        </Suspense>
      ),
    },
  ];

  // Rendu mobile avec Collapse au lieu de Tabs
  const renderMobileContent = () => (
    <Collapse 
      activeKey={activeTab} 
      onChange={(key) => setActiveTab(key[0] || 'profile')}
      accordion
    >
      <Panel header="Profil" key="profile">
        <Suspense fallback={<TabContentSkeleton />}>
          <UserProfileTab user={user} />
        </Suspense>
      </Panel>
      <Panel header="Consommation" key="consumption">
        <Suspense fallback={<TabContentSkeleton />}>
          <UserConsumptionTab userId={user.id} />
        </Suspense>
      </Panel>
      <Panel header="Historique" key="history">
        <Suspense fallback={<TabContentSkeleton />}>
          <UserHistoryTab userId={user.id} />
        </Suspense>
      </Panel>
      <Panel header="Ressources" key="resources">
        <Suspense fallback={<TabContentSkeleton />}>
          <UserResourcesTab userId={user.id} />
        </Suspense>
      </Panel>
      <Panel header="Facturation" key="billing">
        <Suspense fallback={<TabContentSkeleton />}>
          <UserBillingTab userId={user.id} />
        </Suspense>
      </Panel>
    </Collapse>
  );

  return (
    <div style={{ padding: screens.md ? '24px' : '16px' }}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { title: 'Dashboard', href: '/' },
          { title: 'Utilisateurs', href: '/users' },
          { title: user.email },
        ]}
        style={{ marginBottom: 16 }}
      />

      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/users')}
            />
            <div style={{ flex: 1 }}>
              <Title level={4} style={{ margin: 0, fontSize: screens.md ? undefined : '18px' }}>
                {user.name || user.email}
              </Title>
              <Space size="small" style={{ marginTop: 4 }} wrap>
                <span style={{ color: '#666' }}>{user.email}</span>
                <UserStatusBadge status={user.status} />
              </Space>
            </div>
          </div>
          
          {/* Actions desktop */}
          {screens.md ? (
            <Dropdown menu={{ items: actionItems }} placement="bottomRight">
              <Button icon={<MoreOutlined />}>Actions</Button>
            </Dropdown>
          ) : (
            <Button 
              icon={<MoreOutlined />} 
              onClick={() => setMobileActionsOpen(true)}
            >
              Actions
            </Button>
          )}
        </div>
      </Card>

      {/* Tabs/Collapse */}
      <Card>
        {screens.md ? (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          />
        ) : (
          renderMobileContent()
        )}
      </Card>

      {/* Mobile Actions Drawer */}
      <Drawer
        title="Actions"
        placement="bottom"
        open={mobileActionsOpen}
        onClose={() => setMobileActionsOpen(false)}
        height="auto"
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {mobileActions.map((action) => (
            <Button
              key={action.key}
              block
              icon={action.icon}
              danger={action.danger}
              onClick={() => {
                action.onClick();
                setMobileActionsOpen(false);
              }}
            >
              {action.label}
            </Button>
          ))}
        </Space>
      </Drawer>

      {/* Modals */}
      <UpdateRightsModal
        open={rightsModalOpen}
        onClose={() => setRightsModalOpen(false)}
        user={user}
        onSubmit={(data) => {
          actions.updateRights.mutate(data, {
            onSuccess: handleModalSuccess(setRightsModalOpen),
          });
        }}
        loading={actions.updateRights.isPending}
      />

      <UpdateQuotasModal
        open={quotasModalOpen}
        onClose={() => setQuotasModalOpen(false)}
        user={user}
        onSubmit={(data) => {
          actions.updateQuotas.mutate(data, {
            onSuccess: handleModalSuccess(setQuotasModalOpen),
          });
        }}
        loading={actions.updateQuotas.isPending}
      />

      <SuspendUserModal
        open={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        user={user}
        onSubmit={(data) => {
          actions.suspendUser.mutate(data, {
            onSuccess: handleModalSuccess(setSuspendModalOpen),
          });
        }}
        loading={actions.suspendUser.isPending}
      />

      <ResetPasswordModal
        open={resetPasswordModalOpen}
        onClose={() => setResetPasswordModalOpen(false)}
        user={user}
        onSubmit={(data) => {
          actions.resetPassword.mutate(data, {
            onSuccess: handleModalSuccess(setResetPasswordModalOpen),
          });
        }}
        loading={actions.resetPassword.isPending}
      />
    </div>
  );
}; 