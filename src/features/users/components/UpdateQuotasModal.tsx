import React, { useState } from 'react';
import { Modal, Form, InputNumber, Input, Space, Typography, Card, Statistic } from 'antd';
import {
  FileTextOutlined,
  ShareAltOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import type { User, UpdateUserQuotasData } from '../types/users.types';

const { Text } = Typography;
const { TextArea } = Input;

interface UpdateQuotasModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSubmit: (data: UpdateUserQuotasData) => void;
  loading?: boolean;
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

  const handleValuesChange = (_: unknown, allValues: {
    additional_articles?: number;
    additional_social_posts?: number;
    additional_stories?: number;
  }) => {
    // Calcul du coût total (exemple de tarification)
    const articlesCost = (allValues.additional_articles || 0) * 5;
    const postsCost = (allValues.additional_social_posts || 0) * 2;
    const storiesCost = (allValues.additional_stories || 0) * 3;
    setTotalCost(articlesCost + postsCost + storiesCost);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
      setTotalCost(0);
    } catch {
      // Form validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setTotalCost(0);
    onClose();
  };

  return (
    <Modal
      title="Ajouter des crédits"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Confirmer"
      cancelText="Annuler"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          additional_articles: 0,
          additional_social_posts: 0,
          additional_stories: 0,
          reason: '',
        }}
        onValuesChange={handleValuesChange}
      >
        {/* Consommation actuelle */}
        <Card style={{ marginBottom: 24 }}>
          <Text strong>Consommation actuelle</Text>
          <Space style={{ width: '100%', marginTop: 16 }} direction="vertical">
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

        {/* Crédits à ajouter */}
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Form.Item
            name="additional_articles"
            label={
              <Space>
                <FileTextOutlined />
                <span>Articles supplémentaires</span>
              </Space>
            }
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: '100%' }}
              placeholder="0"
              addonAfter="articles"
            />
          </Form.Item>

          <Form.Item
            name="additional_social_posts"
            label={
              <Space>
                <ShareAltOutlined />
                <span>Posts sociaux supplémentaires</span>
              </Space>
            }
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: '100%' }}
              placeholder="0"
              addonAfter="posts"
            />
          </Form.Item>

          <Form.Item
            name="additional_stories"
            label={
              <Space>
                <PictureOutlined />
                <span>Stories supplémentaires</span>
              </Space>
            }
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: '100%' }}
              placeholder="0"
              addonAfter="stories"
            />
          </Form.Item>

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