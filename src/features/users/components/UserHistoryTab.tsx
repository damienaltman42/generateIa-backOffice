import React, { useState } from 'react';
import { Card, Timeline, Input, Select, DatePicker, Space, Tag, Typography, Empty, Pagination } from 'antd';
import {
  SearchOutlined,
  UserSwitchOutlined,
  PlusCircleOutlined,
  StopOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useUserAuditLogs } from '../hooks/useUserDetail';
import type { AuditLog } from '../types/users.types';

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface UserHistoryTabProps {
  userId: string;
}

const actionIcons: Record<string, React.ReactNode> = {
  'user.rights.updated': <UserSwitchOutlined />,
  'user.quotas.updated': <PlusCircleOutlined />,
  'user.suspended': <StopOutlined />,
  'user.reactivated': <CheckCircleOutlined />,
  'user.password.reset': <LockOutlined />,
  'user.created': <UserSwitchOutlined />,
  'user.logged_in': <CheckCircleOutlined />,
};

const actionColors: Record<string, string> = {
  'user.rights.updated': 'gold',
  'user.quotas.updated': 'blue',
  'user.suspended': 'red',
  'user.reactivated': 'green',
  'user.password.reset': 'purple',
  'user.created': 'cyan',
  'user.logged_in': 'default',
};

export const UserHistoryTab: React.FC<UserHistoryTabProps> = ({ userId }) => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    action: undefined as string | undefined,
    dateRange: undefined as [dayjs.Dayjs, dayjs.Dayjs] | undefined,
    search: '',
  });

  const { data: auditLogs, isLoading } = useUserAuditLogs(userId, {
    page,
    limit: 20,
    action: filters.action,
    dateFrom: filters.dateRange?.[0]?.format('YYYY-MM-DD'),
    dateTo: filters.dateRange?.[1]?.format('YYYY-MM-DD'),
  });

  const filteredLogs = auditLogs?.data?.filter((log: AuditLog) => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      log.action.toLowerCase().includes(searchLower) ||
      log.details?.toLowerCase().includes(searchLower) ||
      log.admin_name?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const renderTimelineItem = (log: AuditLog) => {
    const icon = actionIcons[log.action] || <ClockCircleOutlined />;
    const color = actionColors[log.action] || 'default';

    return (
      <Timeline.Item
        key={log.id}
        dot={icon}
        color={color}
      >
        <div style={{ marginBottom: 8 }}>
          <Space>
            <Text strong>{log.action_label || log.action}</Text>
            <Tag color={color}>{log.action}</Tag>
          </Space>
        </div>
        
        {log.details && (
          <div style={{ marginBottom: 4 }}>
            <Text type="secondary">{log.details}</Text>
          </div>
        )}
        
        <Space size="small" style={{ fontSize: 12 }}>
          <Text type="secondary">
            {dayjs(log.created_at).format('DD/MM/YYYY HH:mm')}
          </Text>
          {log.admin_name && (
            <>
              <Text type="secondary">•</Text>
              <Text type="secondary">Par {log.admin_name}</Text>
            </>
          )}
          {log.ip_address && (
            <>
              <Text type="secondary">•</Text>
              <Text type="secondary">IP: {log.ip_address}</Text>
            </>
          )}
        </Space>
      </Timeline.Item>
    );
  };

  return (
    <div>
      {/* Filtres */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input
            placeholder="Rechercher dans l'historique..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ width: 250 }}
          />
          
          <Select
            placeholder="Type d'action"
            allowClear
            value={filters.action}
            onChange={(value) => setFilters({ ...filters, action: value })}
            style={{ width: 200 }}
            options={[
              { label: 'Modification droits', value: 'user.rights.updated' },
              { label: 'Ajout crédits', value: 'user.quotas.updated' },
              { label: 'Suspension', value: 'user.suspended' },
              { label: 'Réactivation', value: 'user.reactivated' },
              { label: 'Reset mot de passe', value: 'user.password.reset' },
              { label: 'Connexion', value: 'user.logged_in' },
            ]}
          />
          
          <RangePicker
            value={filters.dateRange}
            onChange={(dates) => setFilters({ ...filters, dateRange: dates as [dayjs.Dayjs, dayjs.Dayjs] | undefined })}
            format="DD/MM/YYYY"
          />
        </Space>
      </Card>

      {/* Timeline */}
      <Card loading={isLoading}>
        {filteredLogs.length > 0 ? (
          <>
            <Timeline mode="left">
              {filteredLogs.map(renderTimelineItem)}
            </Timeline>
            
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Pagination
                current={page}
                total={auditLogs?.meta?.total || 0}
                pageSize={20}
                onChange={setPage}
                showSizeChanger={false}
              />
            </div>
          </>
        ) : (
          <Empty description="Aucune action trouvée" />
        )}
      </Card>
    </div>
  );
}; 