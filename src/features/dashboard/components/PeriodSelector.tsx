import React from 'react';
import { Select, Switch, Space } from 'antd';
import { CalendarOutlined, SwapOutlined } from '@ant-design/icons';
import type { DashboardPeriod } from '../types/dashboard.types';

const { Option } = Select;

interface PeriodSelectorProps {
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  compare: boolean;
  onCompareChange: (compare: boolean) => void;
}

const periodOptions = [
  { value: 'today', label: "Aujourd'hui" },
  { value: '7d', label: '7 derniers jours' },
  { value: '30d', label: '30 derniers jours' },
  { value: '3m', label: '3 derniers mois' },
  { value: '1y', label: 'Dernière année' },
];

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  period,
  onPeriodChange,
  compare,
  onCompareChange,
}) => {
  return (
    <Space size="middle">
      <Space>
        <CalendarOutlined />
        <Select
          value={period}
          onChange={onPeriodChange}
          style={{ width: 160 }}
        >
          {periodOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Space>
      
      <Space>
        <SwapOutlined />
        <span>Comparer</span>
        <Switch
          checked={compare}
          onChange={onCompareChange}
          size="small"
        />
      </Space>
    </Space>
  );
}; 