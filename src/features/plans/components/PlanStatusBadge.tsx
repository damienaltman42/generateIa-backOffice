import React from 'react';
import { Badge, Tooltip } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined,
  SyncOutlined,
  CloudOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Plan } from '../types/plans.types';

interface PlanStatusBadgeProps {
  plan: Plan;
  showTooltip?: boolean;
}

export const PlanStatusBadge: React.FC<PlanStatusBadgeProps> = ({ 
  plan, 
  showTooltip = true 
}) => {
  const getStatusConfig = () => {
    // Plan Free - pas de Stripe
    if (plan.monthly_price === '0.00' && plan.yearly_price === '0.00') {
      return {
        status: 'default' as const,
        icon: <CloudOutlined />,
        text: 'Local uniquement',
        color: '#8c8c8c',
      };
    }

    // Plans avec Stripe
    switch (plan.stripe_sync_status) {
      case 'synced':
        return {
          status: 'success' as const,
          icon: <CheckCircleOutlined />,
          text: 'Synchronisé',
          color: '#52c41a',
        };
      case 'pending':
        return {
          status: 'processing' as const,
          icon: <SyncOutlined spin />,
          text: 'En attente',
          color: '#1890ff',
        };
      case 'failed':
        return {
          status: 'error' as const,
          icon: <ExclamationCircleOutlined />,
          text: 'Échec',
          color: '#ff4d4f',
        };
      case 'outdated':
        return {
          status: 'warning' as const,
          icon: <ClockCircleOutlined />,
          text: 'Obsolète',
          color: '#faad14',
        };
      default:
        return {
          status: 'default' as const,
          icon: <ClockCircleOutlined />,
          text: 'Inconnu',
          color: '#8c8c8c',
        };
    }
  };

  const statusConfig = getStatusConfig();

  const getTooltipContent = () => {
    const lines = [
      `Statut: ${statusConfig.text}`,
    ];

    if (plan.last_sync_at) {
      lines.push(`Dernière sync: ${dayjs(plan.last_sync_at).format('DD/MM/YYYY HH:mm')}`);
    }

    if (plan.sync_error_message) {
      lines.push(`Erreur: ${plan.sync_error_message}`);
    }

    if (plan.stripe_product_id) {
      lines.push(`Product ID: ${plan.stripe_product_id}`);
    }

    return lines.join('\n');
  };

  const badge = (
    <Badge 
      status={statusConfig.status}
      text={
        <span style={{ color: statusConfig.color }}>
          {statusConfig.icon} {statusConfig.text}
        </span>
      }
    />
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <Tooltip title={<pre style={{ margin: 0 }}>{getTooltipContent()}</pre>}>
      {badge}
    </Tooltip>
  );
}; 