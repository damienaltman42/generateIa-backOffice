import React, { useState, useCallback } from 'react';
import { Table, Tag, Button, Space, Tooltip, Modal, Input, Form } from 'antd';
import { SwapOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { useWhitelistList } from '../hooks/useWhitelistData';
import { useWhitelistActions } from '../hooks/useWhitelistActions';
import type { WhitelistEntry, WhitelistQueryParams } from '../types/whitelist.types';

interface WhitelistTableProps {
  loading?: boolean;
  onMigrate?: (entryId: string) => void;
}

export const WhitelistTable: React.FC<WhitelistTableProps> = ({ 
  loading: externalLoading = false 
}) => {
  const [queryParams, setQueryParams] = useState<WhitelistQueryParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  const [migrationModal, setMigrationModal] = useState<{
    visible: boolean;
    entry?: WhitelistEntry;
  }>({ visible: false });

  const { data, isLoading, error } = useWhitelistList(queryParams);
  const { migrateSingle } = useWhitelistActions();
  const [form] = Form.useForm();

  const handleTableChange: TableProps<WhitelistEntry>['onChange'] = useCallback(
    (
      pagination: TablePaginationConfig,
      _filters: Record<string, FilterValue | null>,
      sorter: SorterResult<WhitelistEntry> | SorterResult<WhitelistEntry>[]
    ) => {
      const newParams: WhitelistQueryParams = {
        ...queryParams,
        page: pagination.current || 1,
        limit: pagination.pageSize || 20,
      };

      // Gérer le tri
      if (sorter && !Array.isArray(sorter) && sorter.field) {
        const sortFieldMap: Record<string, WhitelistQueryParams['sortBy']> = {
          email: 'email',
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          migratedAt: 'migratedAt',
        };

        const field = Array.isArray(sorter.field) ? sorter.field[0] : sorter.field;
        if (field && sortFieldMap[field as string]) {
          newParams.sortBy = sortFieldMap[field as string];
          newParams.sortOrder = sorter.order === 'ascend' ? 'ASC' : 'DESC';
        }
      }

      setQueryParams(newParams);
    },
    [queryParams]
  );

  const handleMigrate = useCallback((entry: WhitelistEntry) => {
    setMigrationModal({ visible: true, entry });
  }, []);

  const handleMigrationConfirm = useCallback(async () => {
    if (!migrationModal.entry) return;

    try {
      const values = await form.validateFields();
      await migrateSingle.mutateAsync({
        whitelistId: migrationModal.entry.id,
        reason: values.reason,
      });
      setMigrationModal({ visible: false });
      form.resetFields();
    } catch (migrationError) {
      // L'erreur est gérée dans le hook
      console.error('Migration error:', migrationError);
    }
  }, [migrationModal.entry, form, migrateSingle]);

  const columns: ColumnsType<WhitelistEntry> = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      sortOrder: queryParams.sortBy === 'email' ? 
        (queryParams.sortOrder === 'ASC' ? 'ascend' : 'descend') : null,
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => (
        <Tag color={source === 'teasing' ? 'blue' : 'green'}>
          {source.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Statut',
      key: 'status',
      render: (_, record) => {
        if (record.migratedAt) {
          return <Tag color="purple" icon={<SwapOutlined />}>Migré</Tag>;
        }
        if (record.isConfirmed) {
          return <Tag color="green" icon={<CheckCircleOutlined />}>Confirmé</Tag>;
        }
        return <Tag color="orange" icon={<CloseCircleOutlined />}>En attente</Tag>;
      },
    },
    {
      title: 'Date d\'inscription',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: true,
      sortOrder: queryParams.sortBy === 'createdAt' ? 
        (queryParams.sortOrder === 'ASC' ? 'ascend' : 'descend') : null,
    },
    {
      title: 'Date de migration',
      dataIndex: 'migratedAt',
      key: 'migratedAt',
      render: (date?: string) => 
        date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
      sorter: true,
      sortOrder: queryParams.sortBy === 'migratedAt' ? 
        (queryParams.sortOrder === 'ASC' ? 'ascend' : 'descend') : null,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.isConfirmed && !record.migratedAt && (
            <Tooltip title="Migrer vers un compte utilisateur">
              <Button
                type="primary"
                size="small"
                icon={<SwapOutlined />}
                onClick={() => handleMigrate(record)}
                loading={migrateSingle.isPending}
              >
                Migrer
              </Button>
            </Tooltip>
          )}
          {record.migratedAt && (
            <Tooltip title="Utilisateur déjà migré">
              <Button size="small" disabled>
                Migré
              </Button>
            </Tooltip>
          )}
          {!record.isConfirmed && (
            <Tooltip title="Email non confirmé">
              <Button size="small" disabled>
                Non confirmé
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Erreur lors du chargement des données</p>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={data?.data || []}
        loading={isLoading || externalLoading}
        rowKey="id"
        pagination={{
          current: queryParams.page,
          pageSize: queryParams.limit,
          total: data?.meta?.total || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} sur ${total} entrées`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        onChange={handleTableChange}
        scroll={{ x: 800 }}
      />

      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
            Confirmer la migration
          </Space>
        }
        open={migrationModal.visible}
        onOk={handleMigrationConfirm}
        onCancel={() => {
          setMigrationModal({ visible: false });
          form.resetFields();
        }}
        confirmLoading={migrateSingle.isPending}
        okText="Migrer"
        cancelText="Annuler"
      >
        <p>
          Êtes-vous sûr de vouloir migrer l'utilisateur{' '}
          <strong>{migrationModal.entry?.email}</strong> vers un compte actif ?
        </p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Cette action créera un compte utilisateur et enverra un email de bienvenue.
        </p>
        
        <Form form={form} layout="vertical">
          <Form.Item
            name="reason"
            label="Raison de la migration"
            rules={[{ required: true, message: 'Veuillez indiquer la raison' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Ex: Migration automatique suite au lancement de la plateforme"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}; 