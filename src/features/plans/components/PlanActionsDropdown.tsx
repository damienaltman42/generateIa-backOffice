import React from 'react';
import { Dropdown, Button, Modal } from 'antd';
import type { MenuProps } from 'antd';
import { 
  MoreOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Plan } from '../types/plans.types';

const { confirm } = Modal;

interface PlanActionsDropdownProps {
  plan: Plan;
  onAction: (action: string, plan: Plan) => void;
}

export const PlanActionsDropdown: React.FC<PlanActionsDropdownProps> = ({ 
  plan, 
  onAction 
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/plans/${plan.id}`);
  };

  const handleEdit = () => {
    navigate(`/plans/${plan.id}/edit`);
  };

  const handleDelete = () => {
    confirm({
      title: 'Supprimer le plan',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Êtes-vous sûr de vouloir supprimer le plan <strong>{plan.display_name}</strong> ?</p>
          <p style={{ color: '#666', fontSize: '12px' }}>
            Cette action marquera le plan comme inactif. Il ne sera plus disponible 
            pour de nouveaux abonnements mais restera visible dans Stripe.
          </p>
        </div>
      ),
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk() {
        onAction('delete', plan);
      },
    });
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'Voir détails',
      onClick: handleViewDetails,
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Modifier',
      onClick: handleEdit,
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Supprimer',
      onClick: handleDelete,
      danger: true,
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Button
        type="text"
        icon={<MoreOutlined />}
        size="small"
        onClick={(e) => e.stopPropagation()}
      />
    </Dropdown>
  );
}; 