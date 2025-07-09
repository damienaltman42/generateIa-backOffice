import React from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb, Spin, Alert } from 'antd';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { PlanForm } from '../components/PlanForm/PlanForm';
import { plansApi } from '../api/plansApi';

export const PlanFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { data: plan, isLoading, error } = useQuery({
    queryKey: ['admin-plan', id],
    queryFn: () => plansApi.getPlan(id!),
    enabled: isEdit,
  });

  const breadcrumbItems = [
    {
      href: '/dashboard',
      title: <HomeOutlined />,
    },
    {
      href: '/plans',
      title: (
        <>
          <SettingOutlined />
          <span>Plans</span>
        </>
      ),
    },
    {
      title: isEdit ? 'Modifier' : 'Nouveau',
    },
  ];

  if (isEdit && isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isEdit && error) {
    return (
      <div style={{ padding: '24px' }}>
        <Breadcrumb items={breadcrumbItems} style={{ marginBottom: '24px' }} />
        <Alert
          message="Erreur de chargement"
          description="Impossible de charger les données du plan"
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} style={{ marginBottom: '24px' }} />
      <PlanForm plan={plan} isEdit={isEdit} />
    </div>
  );
}; 