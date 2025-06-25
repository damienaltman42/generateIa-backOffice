import React from 'react';
import { Table, Tag, Space, Typography, Badge } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { UserStatusBadge } from './UserStatusBadge';
import { ConsumptionProgress } from './ConsumptionProgress';
import { UserActionsDropdown } from './UserActionsDropdown';
import { User, PaginationMeta } from '../types/users.types';
import { CrownOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface UserTableProps {
  users: User[];
  loading: boolean;
  pagination: PaginationMeta | null;
  onTableChange: TableProps<User>['onChange'];
  onAction: (action: string, user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  pagination,
  onTableChange,
  onAction,
}) => {
  const columns: ColumnsType<User> = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      fixed: 'left',
      width: 250,
      render: (email: string, record: User) => (
        <Space>
          <Link to={`/users/${record.id}`}>{email}</Link>
          {record.isAdmin && (
            <Badge>
              <CrownOutlined style={{ color: '#faad14' }} />
            </Badge>
          )}
        </Space>
      ),
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 200,
      render: (name: string, record: User) => (
        <Space direction="vertical" size={0}>
          <Text>{name || '-'}</Text>
          {record.company && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.company}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Plan',
      dataIndex: ['plan', 'display_name'],
      key: 'plan',
      width: 100,
      render: (_, record: User) => {
        if (!record.plan) return <Tag>Aucun</Tag>;
        
        const color = record.plan.name === 'pro' ? 'gold' : 'default';
        return <Tag color={color}>{record.plan.display_name}</Tag>;
      },
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: User['status']) => <UserStatusBadge status={status} />,
    },
    {
      title: 'Consommation',
      key: 'consumption',
      width: 200,
      render: (_, record: User) => (
        <ConsumptionProgress 
          user={record} 
          type="all" 
          showLabel={false}
          size="small"
        />
      ),
    },
    {
      title: 'Date inscription',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      width: 150,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 80,
      render: (_, record: User) => (
        <UserActionsDropdown user={record} onAction={onAction} />
      ),
    },
  ];

  const paginationConfig: TableProps<User>['pagination'] = pagination ? {
    current: pagination.page,
    pageSize: pagination.limit,
    total: pagination.total,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} utilisateurs`,
    pageSizeOptions: ['10', '20', '50', '100'],
  } : false;

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      loading={loading}
      pagination={paginationConfig}
      onChange={onTableChange}
      scroll={{ x: 1200 }}
      size="middle"
    />
  );
}; 