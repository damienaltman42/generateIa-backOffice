import React from 'react';
import { Tag } from 'antd';
import { 
  CheckCircleOutlined, 
  StopOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';
import { UserStatus } from '../types/users.types';

interface UserStatusBadgeProps {
  status: UserStatus;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case UserStatus.ACTIVE:
        return {
          color: 'success',
          icon: <CheckCircleOutlined />,
          text: 'Actif',
        };
      case UserStatus.SUSPENDED:
        return {
          color: 'error',
          icon: <StopOutlined />,
          text: 'Suspendu',
        };
      case UserStatus.TRIAL:
        return {
          color: 'processing',
          icon: <ClockCircleOutlined />,
          text: 'Essai',
        };
      case UserStatus.EXPIRED:
        return {
          color: 'default',
          icon: <CloseCircleOutlined />,
          text: 'Expiré',
        };
      default:
        return {
          color: 'default',
          icon: null,
          text: status,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Tag color={config.color} icon={config.icon}>
      {config.text}
    </Tag>
  );
}; 