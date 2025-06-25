import React from 'react';
import { Card, Skeleton, Space, Tabs } from 'antd';

export const UserDetailSkeleton: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      {/* Breadcrumb skeleton */}
      <Skeleton.Input style={{ width: 300, marginBottom: 16 }} active size="small" />

      {/* Header skeleton */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Skeleton.Button active size="default" />
            <div>
              <Skeleton.Input style={{ width: 200 }} active />
              <Space style={{ marginTop: 8 }}>
                <Skeleton.Input style={{ width: 150 }} active size="small" />
                <Skeleton.Button active size="small" shape="round" />
              </Space>
            </div>
          </Space>
          <Skeleton.Button active />
        </div>
      </Card>

      {/* Tabs skeleton */}
      <Card>
        <Tabs
          items={[
            {
              key: 'profile',
              label: 'Profil',
              children: <ProfileTabSkeleton />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

const ProfileTabSkeleton: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }} size="large">
    <Card>
      <Skeleton active paragraph={{ rows: 4 }} />
    </Card>
    <Card>
      <Skeleton active paragraph={{ rows: 3 }} />
    </Card>
  </Space>
);

export const TabContentSkeleton: React.FC = () => (
  <div style={{ padding: '24px 0' }}>
    <Skeleton active paragraph={{ rows: 4 }} />
    <div style={{ marginTop: 24 }}>
      <Skeleton.Button active style={{ width: '100%', height: 200 }} />
    </div>
    <div style={{ marginTop: 24 }}>
      <Skeleton active paragraph={{ rows: 3 }} />
    </div>
  </div>
); 