import React from 'react';
import { Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import { 
  MoreOutlined, 
  EyeOutlined, 
  StopOutlined, 
  CheckCircleOutlined,
  MailOutlined,
  UserSwitchOutlined,
  PlusCircleOutlined,
  LockOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { User, UserStatus } from '../types/users.types';

interface UserActionsDropdownProps {
  user: User;
  onAction: (action: string, user: User) => void;
}

export const UserActionsDropdown: React.FC<UserActionsDropdownProps> = ({ 
  user, 
  onAction 
}) => {
  const navigate = useNavigate();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'view') {
      navigate(`/users/${user.id}`);
    } else if (key === 'email') {
      window.location.href = `mailto:${user.email}`;
    } else {
      onAction(key, user);
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'view',
      label: 'Voir détails',
      icon: <EyeOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'suspend',
      label: user.status === UserStatus.SUSPENDED ? 'Réactiver' : 'Suspendre',
      icon: user.status === UserStatus.SUSPENDED ? <CheckCircleOutlined /> : <StopOutlined />,
      danger: user.status !== UserStatus.SUSPENDED,
    },
    {
      key: 'rights',
      label: 'Modifier droits',
      icon: <UserSwitchOutlined />,
      danger: user.isAdmin,
    },
    {
      key: 'quotas',
      label: 'Ajouter crédits',
      icon: <PlusCircleOutlined />,
    },
    {
      key: 'reset-password',
      label: 'Réinitialiser mot de passe',
      icon: <LockOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'email',
      label: 'Envoyer email',
      icon: <MailOutlined />,
    },
  ];

  return (
    <Dropdown
      menu={{ items, onClick: handleMenuClick }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Button 
        type="text" 
        icon={<MoreOutlined />}
        onClick={(e) => e.stopPropagation()}
      />
    </Dropdown>
  );
}; 