import React, { useState } from 'react';
import { Card, Tabs, Table, Tag, Space, Button, Image, DatePicker, Select, Statistic, Row, Col, Tooltip } from 'antd';
import {
  FileTextOutlined,
  ShareAltOutlined,
  PictureOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useUserResources, useUserResourcesStats } from '../hooks/useUserDetail';

const { RangePicker } = DatePicker;

interface UserResourcesTabProps {
  userId: string;
}

export const UserResourcesTab: React.FC<UserResourcesTabProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'article' | 'social_post' | 'image'>('article');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    dateRange: undefined as [dayjs.Dayjs, dayjs.Dayjs] | undefined,
    status: undefined as string | undefined,
  });

  const { data: resources, isLoading } = useUserResources(userId, {
    page,
    limit: 10,
    type: activeTab,
    dateFrom: filters.dateRange?.[0]?.format('YYYY-MM-DD'),
    dateTo: filters.dateRange?.[1]?.format('YYYY-MM-DD'),
  });

  // Hook pour récupérer les statistiques sur la période sélectionnée
  const { data: statsData, isLoading: statsLoading } = useUserResourcesStats(userId, {
    dateFrom: filters.dateRange?.[0]?.format('YYYY-MM-DD'),
    dateTo: filters.dateRange?.[1]?.format('YYYY-MM-DD'),
  });

  const renderArticlesTable = () => {
    const columns = [
      {
        title: 'Image',
        dataIndex: 'images',
        key: 'images',
        width: 120,
        render: (images: [{ url: string }]) => (
          (images && images[0]) ? <Image src={images[0].url} width={80} height={80} style={{ objectFit: 'cover' }} /> : "-"
        ),
      },
      {
        title: 'Titre',
        dataIndex: 'title',
        key: 'title',
        width: '30%',
        ellipsis: true,
      },
      {
        title: 'Statut',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        render: (status: string) => {
          console.log('status', status);
          const statusConfig = {
            published: { color: 'success', label: 'Publié' },
            draft: { color: 'default', label: 'Brouillon' },
            scheduled: { color: 'processing', label: 'Programmé' },
          };
          const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', label: status };
          return <Tag color={config.color}>{config.label}</Tag>;
        },
      },
      {
        title: 'Date création',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 120,
        render: () => (
          <Space size="small">
            <Button type="text" icon={<EyeOutlined />} size="small" />
            <Button type="text" icon={<EditOutlined />} size="small" />
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={resources?.data || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          total: resources?.meta?.total || 0,
          pageSize: 10,
          onChange: setPage,
        }}
      />
    );
  };

  const renderSocialPostsTable = () => {
    const columns = [
      {
        title: 'Aperçu',
        dataIndex: 'images',
        key: 'images',
        width: 100,
        render: (images: [{ url: string }]) => (
          (images && images[0]) ? <Image src={images[0].url} width={60} height={60} style={{ objectFit: 'cover' }} /> : '-'
        ),
      },
      {
        title: 'Contenu',
        dataIndex: 'metadata',
        key: 'metadata',
        width: '40%',
        ellipsis: { showTitle: false },
        render: (metadata: { content: string, articleId: string, articleTitle: string, description: string, postUrl: string, link: string }) => (
          <Tooltip title={metadata.content || metadata.description || '-'}>
            <div style={{ 
              maxWidth: '100%', 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {metadata.content || metadata.description || '-'}
            </div>
          </Tooltip>
        ),
      },
      {
        title: 'Plateformes',
        dataIndex: 'metadata',
        key: 'metadata',
        width: 200,
        render: (metadata: { socialType: string, postType: string }) => (
          <Space size="small" wrap>
              <Tag key={metadata.socialType} color="blue">{metadata.socialType} ({metadata.postType})</Tag>
          </Space>
        ),
      },
      {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 100,
        render: () => (
          <Space size="small">
            <Button type="text" icon={<EyeOutlined />} size="small" />
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={resources?.data || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          total: resources?.meta?.total || 0,
          pageSize: 10,
          onChange: setPage,
        }}
      />
    );
  };

  const renderImagesTable = () => {
    const columns = [
      {
        title: 'Image',
        dataIndex: 'metadata',
        key: 'metadata',
        width: 120,
        render: (metadata: { url: string }) => (
          <Image src={metadata.url} width={80} height={80} style={{ objectFit: 'cover' }} />
        ),
      },
      {
        title: 'Nom',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
      },
      {
        title: 'Taille',
        dataIndex: 'size',
        key: 'size',
        width: 100,
        render: (size: number) => `${(size / 1024 / 1024).toFixed(2)} MB`,
      },
      {
        title: 'Format',
        dataIndex: 'format',
        key: 'format',
        width: 80,
      },
      {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 100,
        render: () => (
          <Space size="small">
            <Button type="text" icon={<EyeOutlined />} size="small" />
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={resources?.data || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          total: resources?.meta?.total || 0,
          pageSize: 10,
          onChange: setPage,
        }}
      />
    );
  };

  const tabItems = [
    {
      key: 'article',
      label: (
        <span>
          <FileTextOutlined /> Articles
        </span>
      ),
      children: renderArticlesTable(),
    },
    {
      key: 'social_post',
      label: (
        <span>
          <ShareAltOutlined /> Posts sociaux
        </span>
      ),
      children: renderSocialPostsTable(),
    },
    {
      key: 'image',
      label: (
        <span>
          <PictureOutlined /> Images
        </span>
      ),
      children: renderImagesTable(),
    },
  ];

  return (
    <div>
      {/* Statistiques */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card loading={statsLoading}>
            <Statistic
              title={`Articles ${filters.dateRange ? 'sur la période' : 'depuis le début'}`}
              value={statsData?.stats?.articles || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={statsLoading}>
            <Statistic
              title={`Posts sociaux ${filters.dateRange ? 'sur la période' : 'depuis le début'}`}
              value={statsData?.stats?.social_posts || 0}
              prefix={<ShareAltOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={statsLoading}>
            <Statistic
              title={`Images ${filters.dateRange ? 'sur la période' : 'depuis le début'}`}
              value={statsData?.stats?.images || 0}
              prefix={<PictureOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filtres */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <RangePicker
            value={filters.dateRange}
            onChange={(dates) => setFilters({ ...filters, dateRange: dates as [dayjs.Dayjs, dayjs.Dayjs] | undefined })}
            format="DD/MM/YYYY"
          />
          <Select
            placeholder="Statut"
            allowClear
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            style={{ width: 150 }}
            options={[
              { label: 'Publié', value: 'published' },
              { label: 'Brouillon', value: 'draft' },
              { label: 'Programmé', value: 'scheduled' },
            ]}
          />
        </Space>
      </Card>

      {/* Tabs avec tables */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key as typeof activeTab);
            setPage(1);
          }}
          items={tabItems}
        />
      </Card>
    </div>
  );
}; 