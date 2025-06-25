import React from 'react';
import { Modal, Form, Switch, Input, Alert, Space, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import type { User, UpdateUserRightsData } from '../types/users.types';

const { Text } = Typography;
const { TextArea } = Input;

interface UpdateRightsModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSubmit: (data: UpdateUserRightsData) => void;
  loading?: boolean;
}

export const UpdateRightsModal: React.FC<UpdateRightsModalProps> = ({
  open,
  onClose,
  user,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();
  const isAdmin = Form.useWatch('isAdmin', form);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      // Form validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Modifier les droits"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Confirmer"
      cancelText="Annuler"
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          isAdmin: user.isAdmin,
          reason: '',
        }}
      >
        <Form.Item
          name="isAdmin"
          label="Droits administrateur"
          valuePropName="checked"
        >
          <Switch
            checkedChildren="Admin"
            unCheckedChildren="Utilisateur"
          />
        </Form.Item>

        {isAdmin !== user.isAdmin && (
          <>
            {!user.isAdmin && isAdmin && (
              <Alert
                message="Attention"
                description="Vous êtes sur le point d'accorder des droits administrateur à cet utilisateur. Il pourra accéder à toutes les fonctionnalités d'administration."
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                style={{ marginBottom: 16 }}
              />
            )}

            {user.isAdmin && !isAdmin && (
              <Alert
                message="Attention"
                description="Vous êtes sur le point de retirer les droits administrateur à cet utilisateur. Il perdra l'accès aux fonctionnalités d'administration."
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                style={{ marginBottom: 16 }}
              />
            )}

            <Form.Item
              name="reason"
              label="Raison du changement"
              rules={[
                { required: true, message: 'Veuillez indiquer une raison' },
                { min: 10, message: 'La raison doit contenir au moins 10 caractères' },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Expliquez pourquoi vous modifiez les droits de cet utilisateur..."
              />
            </Form.Item>
          </>
        )}
      </Form>

      <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
        <Text type="secondary">
          Utilisateur : <Text strong>{user.email}</Text>
        </Text>
        <Text type="secondary">
          Statut actuel : <Text strong>{user.isAdmin ? 'Administrateur' : 'Utilisateur'}</Text>
        </Text>
      </Space>
    </Modal>
  );
}; 