import React, { useState, useCallback } from 'react';
import { Card, Button, Space, Typography, Breadcrumb } from 'antd';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { TableProps } from 'antd/es/table';
import { PlanTable } from '../components/PlanTable';
import { PlanFilters } from '../components/PlanFilters';
import { usePlansList, usePlanActions } from '../hooks/usePlansList';
import type { Plan, PlansListParams } from '../types/plans.types';

const { Title } = Typography;

const defaultFilters: PlansListParams = {
  page: 1,
  limit: 20,
  sort_by: 'created_at',
  sort_order: 'DESC',
};

export const PlansListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PlansListParams>(defaultFilters);
  
  const { data, isLoading, error } = usePlansList(filters);
  const { deletePlan, syncAllPlans } = usePlanActions();

  const handleFiltersChange = useCallback((newFilters: PlansListParams) => {
    setFilters(newFilters);
  }, []);

  const handleFiltersReset = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleTableChange: TableProps<Plan>['onChange'] = (pagination, _, sorter) => {
    const newFilters: PlansListParams = {
      ...filters,
      page: pagination?.current || 1,
      limit: pagination?.pageSize || 20,
    };

    // Handle sorting
    if (sorter && !Array.isArray(sorter) && sorter.field) {
      newFilters.sort_by = sorter.field as string;
      newFilters.sort_order = sorter.order === 'ascend' ? 'ASC' : 'DESC';
    }

    setFilters(newFilters);
  };

  const handleAction = async (action: string, plan: Plan) => {
    switch (action) {
      case 'delete':
        await deletePlan.mutateAsync(plan.id);
        break;
      default:
        console.log('Action not handled:', action, plan);
    }
  };

  const handleNewPlan = () => {
    navigate('/plans/new');
  };

  const handleSyncAll = () => {
    syncAllPlans.mutate({ dryRun: false });
  };

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Typography.Text type="danger">
            Erreur lors du chargement des plans: {error.message}
          </Typography.Text>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Administration</Breadcrumb.Item>
        <Breadcrumb.Item>Plans</Breadcrumb.Item>
      </Breadcrumb>

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24 
      }}>
        <Title level={2} style={{ margin: 0 }}>
          Gestion des Plans
        </Title>
        
        <Space>
          <Button
            icon={<SyncOutlined />}
            loading={syncAllPlans.isPending}
            onClick={handleSyncAll}
            title="Synchroniser tous les plans avec Stripe"
          >
            Synchroniser tout
          </Button>
          
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleNewPlan}
          >
            Nouveau Plan
          </Button>
        </Space>
      </div>

      {/* Filters */}
      <PlanFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleFiltersReset}
      />

      {/* Table */}
      <Card>
        <PlanTable
          plans={data?.data || []}
          loading={isLoading}
          pagination={data?.meta || null}
          onTableChange={handleTableChange}
          onAction={handleAction}
        />
      </Card>
    </div>
  );
}; 