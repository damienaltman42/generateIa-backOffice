import React from 'react';
import { Progress, Space, Tooltip } from 'antd';
import { User } from '../types/users.types';

interface ConsumptionProgressProps {
  user: User;
  type?: 'articles' | 'social_posts' | 'stories' | 'all';
  showLabel?: boolean;
  size?: 'small' | 'default';
}

export const ConsumptionProgress: React.FC<ConsumptionProgressProps> = ({ 
  user, 
  type = 'all',
  showLabel = true,
  size = 'default'
}) => {
  const getProgressColor = (percent: number) => {
    if (percent >= 90) return '#ff4d4f'; // Rouge
    if (percent >= 70) return '#faad14'; // Orange
    return '#52c41a'; // Vert
  };

  const renderProgress = (
    used: number, 
    limit: number, 
    percent: number, 
    label: string
  ) => {
    const color = getProgressColor(percent);
    const tooltipText = `${used} / ${limit} ${label} (${percent.toFixed(1)}%)`;
    
    return (
      <Tooltip title={tooltipText}>
        <div style={{ minWidth: size === 'small' ? 100 : 150 }}>
          {showLabel && (
            <span style={{ fontSize: size === 'small' ? 12 : 14 }}>
              {label}: {used}/{limit}
            </span>
          )}
          <Progress
            percent={percent}
            strokeColor={color}
            size={size}
            showInfo={false}
            style={{ marginBottom: 0 }}
          />
        </div>
      </Tooltip>
    );
  };

  const renderAllProgress = () => {
    return (
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {renderProgress(
          user.articles_used,
          user.effective_limits.articles,
          user.consumption_percentage.articles,
          'Articles'
        )}
        {renderProgress(
          user.social_posts_used,
          user.effective_limits.social_posts,
          user.consumption_percentage.social_posts,
          'Posts'
        )}
        {renderProgress(
          user.stories_used,
          user.effective_limits.stories,
          user.consumption_percentage.stories,
          'Stories'
        )}
      </Space>
    );
  };

  if (type === 'all') {
    return renderAllProgress();
  }

  // Render single progress
  switch (type) {
    case 'articles':
      return renderProgress(
        user.articles_used,
        user.effective_limits.articles,
        user.consumption_percentage.articles,
        'Articles'
      );
    case 'social_posts':
      return renderProgress(
        user.social_posts_used,
        user.effective_limits.social_posts,
        user.consumption_percentage.social_posts,
        'Posts'
      );
    case 'stories':
      return renderProgress(
        user.stories_used,
        user.effective_limits.stories,
        user.consumption_percentage.stories,
        'Stories'
      );
    default:
      return null;
  }
}; 