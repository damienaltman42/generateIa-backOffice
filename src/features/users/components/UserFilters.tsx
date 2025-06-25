import React, { useState, useCallback } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Slider, 
  Button, 
  Space, 
  Row, 
  Col,
  Badge
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { UserStatus, UserRole, UsersListParams } from '../types/users.types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface UserFiltersProps {
  filters: UsersListParams;
  onFiltersChange: (filters: UsersListParams) => void;
  loading?: boolean;
}

export const UserFilters: React.FC<UserFiltersProps> = ({ 
  filters, 
  onFiltersChange,
  loading = false 
}) => {
  const [form] = Form.useForm();
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Calculer le nombre de filtres actifs
  const calculateActiveFilters = useCallback((values: UsersListParams) => {
    let count = 0;
    if (values.email) count++;
    if (values.name) count++;
    if (values.status) count++;
    if (values.plan) count++;
    if (values.role) count++;
    if (values.dateFrom || values.dateTo) count++;
    if (values.consumptionThreshold && values.consumptionThreshold > 0) count++;
    setActiveFiltersCount(count);
  }, []);

  const handleValuesChange = useCallback((changedValues: any, allValues: any) => {
    const newFilters: UsersListParams = {
      ...filters,
      ...allValues,
      page: 1, // Reset page on filter change
    };

    // Gérer les dates
    if (changedValues.dateRange) {
      if (changedValues.dateRange && changedValues.dateRange[0] && changedValues.dateRange[1]) {
        newFilters.dateFrom = changedValues.dateRange[0].format('YYYY-MM-DD');
        newFilters.dateTo = changedValues.dateRange[1].format('YYYY-MM-DD');
      } else {
        delete newFilters.dateFrom;
        delete newFilters.dateTo;
      }
      delete (newFilters as any).dateRange;
    }

    calculateActiveFilters(newFilters);
    onFiltersChange(newFilters);
  }, [filters, onFiltersChange, calculateActiveFilters]);

  const handleReset = () => {
    form.resetFields();
    setActiveFiltersCount(0);
    onFiltersChange({ page: 1, limit: filters.limit });
  };

  // Initialiser le formulaire avec les filtres existants
  React.useEffect(() => {
    const initialValues: any = { ...filters };
    if (filters.dateFrom && filters.dateTo) {
      initialValues.dateRange = [dayjs(filters.dateFrom), dayjs(filters.dateTo)];
    }
    form.setFieldsValue(initialValues);
    calculateActiveFilters(filters);
  }, [filters, form, calculateActiveFilters]);

  return (
    <Card 
      title={
        <Space>
          <span>Filtres</span>
          {activeFiltersCount > 0 && (
            <Badge count={activeFiltersCount} style={{ backgroundColor: '#52c41a' }} />
          )}
        </Space>
      }
      extra={
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleReset}
          disabled={activeFiltersCount === 0}
        >
          Réinitialiser
        </Button>
      }
      style={{ marginBottom: 16 }}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={filters}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="email" label="Email">
              <Input 
                prefix={<SearchOutlined />} 
                placeholder="Rechercher par email"
                allowClear
                disabled={loading}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="name" label="Nom">
              <Input 
                prefix={<SearchOutlined />} 
                placeholder="Rechercher par nom"
                allowClear
                disabled={loading}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="status" label="Statut">
              <Select
                placeholder="Tous les statuts"
                allowClear
                disabled={loading}
                options={[
                  { label: 'Actif', value: UserStatus.ACTIVE },
                  { label: 'Suspendu', value: UserStatus.SUSPENDED },
                  { label: 'Essai', value: UserStatus.TRIAL },
                  { label: 'Expiré', value: UserStatus.EXPIRED },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="plan" label="Plan">
              <Select
                placeholder="Tous les plans"
                allowClear
                disabled={loading}
                options={[
                  { label: 'Free', value: 'free' },
                  { label: 'Pro', value: 'pro' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="role" label="Rôle">
              <Select
                placeholder="Tous les rôles"
                allowClear
                disabled={loading}
                options={[
                  { label: 'Utilisateur', value: UserRole.USER },
                  { label: 'Administrateur', value: UserRole.ADMIN },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="dateRange" label="Date d'inscription">
              <RangePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                disabled={loading}
                placeholder={['Date début', 'Date fin']}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={16} lg={12}>
            <Form.Item 
              name="consumptionThreshold" 
              label="Seuil de consommation"
              tooltip="Filtrer les utilisateurs ayant dépassé ce pourcentage de consommation"
            >
              <Slider
                min={0}
                max={100}
                marks={{
                  0: '0%',
                  50: '50%',
                  70: '70%',
                  90: '90%',
                  100: '100%'
                }}
                disabled={loading}
                tooltip={{ formatter: (value) => `${value}%` }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}; 