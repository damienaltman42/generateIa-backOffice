import React from 'react';
import { Table, Tag, Space, Typography } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { PlanStatusBadge } from './PlanStatusBadge';
import { PlanActionsDropdown } from './PlanActionsDropdown';
import { Plan, PaginationMeta } from '../types/plans.types';
import { EuroOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface PlanTableProps {
  plans: Plan[];
  loading: boolean;
  pagination: PaginationMeta | null;
  onTableChange: TableProps<Plan>['onChange'];
  onAction: (action: string, plan: Plan) => void;
}

export const PlanTable: React.FC<PlanTableProps> = ({
  plans,
  loading,
  pagination,
  onTableChange,
  onAction,
}) => {
  const formatPrice = (monthly: string, yearly: string, discount: number) => {
    const monthlyPrice = parseFloat(monthly);
    const yearlyPrice = parseFloat(yearly);
    
    if (monthlyPrice === 0 && yearlyPrice === 0) {
      return <Tag color="green">Gratuit</Tag>;
    }

    const elements = [];
    
    if (monthlyPrice > 0) {
      elements.push(
        <Text key="monthly">
          <EuroOutlined /> {monthlyPrice}/mois
        </Text>
      );
    }
    
    if (yearlyPrice > 0) {
      elements.push(
        <Text key="yearly" type="secondary" style={{ fontSize: 12 }}>
          <EuroOutlined /> {yearlyPrice}/an
          {discount > 0 && (
            <Tag color="orange" style={{ marginLeft: 4, fontSize: 10 }}>
              -{discount}%
            </Tag>
          )}
        </Text>
      );
    }

    return (
      <Space direction="vertical" size={0}>
        {elements}
      </Space>
    );
  };

  const formatLimits = (articles: number, posts: number, stories: number) => {
    return (
      <Space direction="vertical" size={0}>
        <Text style={{ fontSize: 12 }}>
          {articles} article{articles > 1 ? 's' : ''}
        </Text>
        <Text style={{ fontSize: 12 }}>
          {posts} post{posts > 1 ? 's' : ''}
        </Text>
        <Text style={{ fontSize: 12 }}>
          {stories} stor{stories > 1 ? 'ies' : 'y'}
        </Text>
      </Space>
    );
  };

  const columns: ColumnsType<Plan> = [
    {
      title: 'Nom',
      dataIndex: 'display_name',
      key: 'display_name',
      sorter: true,
      fixed: 'left',
      width: 200,
      render: (displayName: string, record: Plan) => (
        <Space direction="vertical" size={0}>
          <Link to={`/plans/${record.id}`}>
            <Text strong>{displayName}</Text>
          </Link>
          <Tag color="default" style={{ fontSize: 10 }}>
            {record.name}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Limites',
      key: 'limits',
      width: 120,
      render: (_, record: Plan) => formatLimits(
        record.articles_limit, 
        record.social_posts_limit, 
        record.stories_limit
      ),
    },
    {
      title: 'Prix',
      key: 'pricing',
      sorter: true,
      width: 150,
      render: (_, record: Plan) => formatPrice(
        record.monthly_price,
        record.yearly_price,
        record.yearly_discount_percent
      ),
    },
    {
      title: 'Statut Stripe',
      key: 'stripe_status',
      width: 160,
      render: (_, record: Plan) => <PlanStatusBadge plan={record} />,
    },
    {
      title: 'Actif',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 80,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Oui' : 'Non'}
        </Tag>
      ),
    },
    {
      title: 'Créé le',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 80,
      render: (_, record: Plan) => (
        <PlanActionsDropdown plan={record} onAction={onAction} />
      ),
    },
  ];

  const paginationConfig: TableProps<Plan>['pagination'] = pagination ? {
    current: pagination.page,
    pageSize: pagination.limit,
    total: pagination.total,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} plans`,
    pageSizeOptions: ['10', '20', '50', '100'],
  } : false;

  return (
    <Table
      columns={columns}
      dataSource={plans}
      rowKey="id"
      loading={loading}
      pagination={paginationConfig}
      onChange={onTableChange}
      scroll={{ x: 1000 }}
      size="middle"
    />
  );
}; 