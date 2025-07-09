import React from 'react';
import { Card, Input, Select, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { PlansListParams } from '../types/plans.types';

const { Search } = Input;
const { Option } = Select;

interface PlanFiltersProps {
  filters: PlansListParams;
  onFiltersChange: (filters: PlansListParams) => void;
  onReset: () => void;
}

export const PlanFilters: React.FC<PlanFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined,
      page: 1, // Reset to first page
    });
  };

  const handleStatusChange = (value: boolean | undefined) => {
    onFiltersChange({
      ...filters,
      is_active: value,
      page: 1,
    });
  };

  const handleStripeStatusChange = (value: string | undefined) => {
    onFiltersChange({
      ...filters,
      stripe_sync_status: value as 'pending' | 'synced' | 'failed' | 'outdated' | undefined,
      page: 1,
    });
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Space wrap size="middle">
        <Search
          placeholder="Rechercher par nom..."
          allowClear
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onSearch={handleSearchChange}
          style={{ width: 250 }}
          prefix={<SearchOutlined />}
        />

        <Select
          placeholder="Statut"
          allowClear
          value={filters.is_active}
          onChange={handleStatusChange}
          style={{ width: 120 }}
        >
          <Option value={true}>Actifs</Option>
          <Option value={false}>Inactifs</Option>
        </Select>

        <Select
          placeholder="Statut Stripe"
          allowClear
          value={filters.stripe_sync_status}
          onChange={handleStripeStatusChange}
          style={{ width: 140 }}
        >
          <Option value="synced">Synchronisé</Option>
          <Option value="pending">En attente</Option>
          <Option value="failed">Échec</Option>
          <Option value="outdated">Obsolète</Option>
        </Select>

        <Button
          icon={<ReloadOutlined />}
          onClick={onReset}
          title="Réinitialiser les filtres"
        >
          Réinitialiser
        </Button>
      </Space>
    </Card>
  );
}; 