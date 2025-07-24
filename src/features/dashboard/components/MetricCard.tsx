import React from 'react';
import { Card, Statistic, Space, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface MetricCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  precision?: number;
  trend?: number;
  trendLabel?: string;
  info?: string;
  link?: string;
  loading?: boolean;
  formatter?: (value: number | string) => React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  precision = 0,
  trend,
  trendLabel,
  info,
  link,
  loading = false,
  formatter,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  const renderTrend = () => {
    if (trend === undefined) return null;

    const isPositive = trend > 0;
    const color = isPositive ? '#52c41a' : '#ff4d4f';
    const Icon = isPositive ? ArrowUpOutlined : ArrowDownOutlined;

    return (
      <Space size="small">
        <Icon style={{ color }} />
        <span style={{ color, fontSize: '14px' }}>
          {Math.abs(trend).toFixed(1)}%
        </span>
        {trendLabel && (
          <span style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {trendLabel}
          </span>
        )}
      </Space>
    );
  };

  return (
    <Card
      hoverable={!!link}
      onClick={handleClick}
      style={{ height: '100%', cursor: link ? 'pointer' : 'default' }}
      loading={loading}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Space>
          <span style={{ fontSize: '14px', color: '#8c8c8c' }}>{title}</span>
          {info && (
            <Tooltip title={info}>
              <InfoCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
            </Tooltip>
          )}
        </Space>
        
        <Statistic
          value={typeof value === 'number' ? value : 0}
          prefix={prefix}
          suffix={suffix}
          precision={precision}
          formatter={formatter || ((val) => val.toLocaleString())}
          valueStyle={{ fontSize: '24px', fontWeight: 600 }}
        />
        
        {renderTrend()}
      </Space>
    </Card>
  );
}; 