import React, { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography, Space, Button, message, Modal } from 'antd';
import { ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TableProps, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useUsersList } from '../hooks/useUsersList';
import { UserTable } from '../components/UserTable';
import { UserFilters } from '../components/UserFilters';
import { User, UsersListParams, SortField, SortOrder } from '../types/users.types';
import { useDebounce } from '../../../hooks/useDebounce';

const { Title } = Typography;

export const UsersListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionModal, setActionModal] = useState<string | null>(null);

  // Extraire les filtres depuis l'URL
  const filtersFromUrl = useMemo<UsersListParams>(() => {
    const params: UsersListParams = {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 20,
    };

    // Ajouter les autres filtres s'ils existent
    const email = searchParams.get('email');
    if (email) params.email = email;

    const name = searchParams.get('name');
    if (name) params.name = name;

    const status = searchParams.get('status');
    if (status) params.status = status as UsersListParams['status'];

    const plan = searchParams.get('plan');
    if (plan) params.plan = plan as UsersListParams['plan'];

    const role = searchParams.get('role');
    if (role) params.role = role as UsersListParams['role'];

    const dateFrom = searchParams.get('dateFrom');
    if (dateFrom) params.dateFrom = dateFrom;

    const dateTo = searchParams.get('dateTo');
    if (dateTo) params.dateTo = dateTo;

    const consumptionThreshold = searchParams.get('consumptionThreshold');
    if (consumptionThreshold) params.consumptionThreshold = Number(consumptionThreshold);

    const sortBy = searchParams.get('sortBy');
    if (sortBy) params.sortBy = sortBy as SortField;

    const sortOrder = searchParams.get('sortOrder');
    if (sortOrder) params.sortOrder = sortOrder as SortOrder;

    return params;
  }, [searchParams]);

  // État local pour les filtres (avec debounce pour la recherche)
  const [filters, setFilters] = useState<UsersListParams>(filtersFromUrl);
  const debouncedFilters = useDebounce(filters, 300);

  // Query pour récupérer les utilisateurs
  const { data, isLoading, error, refetch } = useUsersList(debouncedFilters);

  // Mettre à jour l'URL quand les filtres changent
  const updateUrlParams = useCallback((newFilters: UsersListParams) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });

    setSearchParams(params);
  }, [setSearchParams]);

  // Gérer le changement de filtres
  const handleFiltersChange = useCallback((newFilters: UsersListParams) => {
    setFilters(newFilters);
    updateUrlParams(newFilters);
  }, [updateUrlParams]);

  // Gérer le changement de table (pagination, tri)
  const handleTableChange: TableProps<User>['onChange'] = useCallback(
    (
      pagination: TablePaginationConfig,
      tableFilters: Record<string, FilterValue | null>,
      sorter: SorterResult<User> | SorterResult<User>[]
    ) => {
      const newFilters: UsersListParams = {
        ...filters,
        page: pagination.current || 1,
        limit: pagination.pageSize || 20,
      };

      // Gérer le tri
      if (sorter && !Array.isArray(sorter) && sorter.field) {
        const sortFieldMap: Record<string, SortField> = {
          email: SortField.EMAIL,
          name: SortField.NAME,
          createdAt: SortField.CREATED_AT,
          articles_used: SortField.ARTICLES_USED,
          social_posts_used: SortField.SOCIAL_POSTS_USED,
          stories_used: SortField.STORIES_USED,
        };

        const field = Array.isArray(sorter.field) ? sorter.field[0] : sorter.field;
        if (field && sortFieldMap[field as string]) {
          newFilters.sortBy = sortFieldMap[field as string];
          newFilters.sortOrder = sorter.order === 'ascend' ? SortOrder.ASC : SortOrder.DESC;
        } else {
          delete newFilters.sortBy;
          delete newFilters.sortOrder;
        }
      }

      handleFiltersChange(newFilters);
    },
    [filters, handleFiltersChange]
  );

  // Gérer les actions sur les utilisateurs
  const handleUserAction = useCallback((action: string, user: User) => {
    setSelectedUser(user);
    setActionModal(action);
  }, []);

  // Export CSV (placeholder)
  const handleExport = useCallback(() => {
    message.info('Export CSV en cours de développement');
  }, []);

  // Gérer les erreurs
  if (error) {
    message.error('Erreur lors du chargement des utilisateurs');
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={2} style={{ margin: 0 }}>Utilisateurs</Title>
          <Space>
            <Button 
              icon={<ExportOutlined />} 
              onClick={handleExport}
            >
              Exporter
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => refetch()}
              loading={isLoading}
            >
              Actualiser
            </Button>
          </Space>
        </Space>
      </div>

      <UserFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        loading={isLoading}
      />

      <UserTable
        users={data?.data || []}
        loading={isLoading}
        pagination={data?.meta || null}
        onTableChange={handleTableChange}
        onAction={handleUserAction}
      />

      {/* Les modales d'action seront ajoutées ici plus tard */}
      {actionModal && selectedUser && (
        <Modal
          title={`Action: ${actionModal}`}
          open={true}
          onCancel={() => {
            setActionModal(null);
            setSelectedUser(null);
          }}
          footer={null}
        >
          <p>Modal pour l'action "{actionModal}" sur l'utilisateur {selectedUser.email}</p>
          <p>À implémenter dans la phase suivante</p>
        </Modal>
      )}
    </div>
  );
}; 