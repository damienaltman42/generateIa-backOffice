import React, { useState } from 'react';
import { Modal, Form, InputNumber, Input, Space, Typography, Card, Statistic, Alert } from 'antd';
import {
  FileTextOutlined,
  ShareAltOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import type { User, UpdateUserQuotasData } from '../types/users.types';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface UpdateQuotasModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSubmit: (data: UpdateUserQuotasData) => void;
  loading?: boolean;
}

interface FormValues {
  extraArticles?: number;
  extraSocialPosts?: number;
  extraStories?: number;
  reason: string;
}

export const UpdateQuotasModal: React.FC<UpdateQuotasModalProps> = ({
  open,
  onClose,
  user,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();
  const [totalCost, setTotalCost] = useState(0);

  const handleValuesChange = (_: unknown, allValues: FormValues) => {
    // Calcul du coût total (exemple de tarification)
    const articlesCost = (allValues.extraArticles || 0) * 5;
    const postsCost = (allValues.extraSocialPosts || 0) * 2;
    const storiesCost = (allValues.extraStories || 0) * 3;
    setTotalCost(articlesCost + postsCost + storiesCost);
  };

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      extraArticles: values.extraArticles || 0,
      extraSocialPosts: values.extraSocialPosts || 0,
      extraStories: values.extraStories || 0,
      reason: values.reason,
    });
    form.resetFields();
    setTotalCost(0);
  };

  const handleCancel = () => {
    form.resetFields();
    setTotalCost(0);
    onClose();
  };

  return (
    <Modal
      title="Ajouter des crédits supplémentaires"
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Confirmer"
      cancelText="Annuler"
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        initialValues={{
          extraArticles: 0,
          extraSocialPosts: 0,
          extraStories: 0,
          reason: '',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card style={{ marginBottom: 16 }}>
            <Text strong>Consommation actuelle</Text>
            <Space style={{ width: '100%', marginTop: 8 }} direction="vertical">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Articles</Text>
                <Text>{user.articles_used} / {user.effective_limits.articles}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Posts sociaux</Text>
                <Text>{user.social_posts_used} / {user.effective_limits.social_posts}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Stories</Text>
                <Text>{user.stories_used} / {user.effective_limits.stories}</Text>
              </div>
            </Space>
          </Card>

          <Alert
            message="Information"
            description="Ces crédits supplémentaires s'ajoutent aux quotas mensuels de l'utilisateur et sont permanents."
            type="info"
            showIcon
          />

          <div>
            <Title level={5}>
              <FileTextOutlined /> Articles supplémentaires
            </Title>
            <Form.Item
              name="extraArticles"
              rules={[
                { type: 'number', min: 0, message: 'Le nombre doit être positif' },
              ]}
            >
              <InputNumber
                min={0}
                placeholder="0"
                style={{ width: '100%' }}
                addonAfter="articles"
              />
            </Form.Item>
          </div>

          <div>
            <Title level={5}>
              <ShareAltOutlined /> Posts sociaux supplémentaires
            </Title>
            <Form.Item
              name="extraSocialPosts"
              rules={[
                { type: 'number', min: 0, message: 'Le nombre doit être positif' },
              ]}
            >
              <InputNumber
                min={0}
                placeholder="0"
                style={{ width: '100%' }}
                addonAfter="posts"
              />
            </Form.Item>
          </div>

          <div>
            <Title level={5}>
              <PictureOutlined /> Stories supplémentaires
            </Title>
            <Form.Item
              name="extraStories"
              rules={[
                { type: 'number', min: 0, message: 'Le nombre doit être positif' },
              ]}
            >
              <InputNumber
                min={0}
                placeholder="0"
                style={{ width: '100%' }}
                addonAfter="stories"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="reason"
            label="Raison de l'ajout"
            rules={[
              { required: true, message: 'Veuillez indiquer une raison' },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="Expliquez pourquoi vous ajoutez ces crédits..."
            />
          </Form.Item>
        </Space>

        {/* Coût total */}
        {totalCost > 0 && (
          <Card style={{ marginTop: 24, background: '#f0f2f5' }}>
            <Statistic
              title="Coût total estimé"
              value={totalCost}
              precision={2}
              suffix="€"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        )}
      </Form>
    </Modal>
  );
}; 