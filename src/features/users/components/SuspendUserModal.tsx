import React from 'react';
import { Modal, Form, Input, DatePicker, Checkbox, Alert, Space, Typography } from 'antd';
import { WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { User, SuspendUserData } from '../types/users.types';

const { Text } = Typography;
const { TextArea } = Input;

interface SuspendUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSubmit: (data: SuspendUserData) => void;
  loading?: boolean;
}

export const SuspendUserModal: React.FC<SuspendUserModalProps> = ({
  open,
  onClose,
  user,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();
  const isSuspended = user.status === 'suspended';
  const action = isSuspended ? 'reactivate' : 'suspend';

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
        action,
        endDate: values.endDate?.format('YYYY-MM-DD'),
      });
    } catch {
      // Form validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // Réinitialiser le formulaire quand la modal se ferme
  React.useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  return (
    <Modal
      title={isSuspended ? 'Réactiver l\'utilisateur' : 'Suspendre l\'utilisateur'}
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
          reason: '',
          notifyUser: true,
        }}
      >
        <Alert
          message={isSuspended ? 'Réactivation' : 'Suspension'}
          description={
            isSuspended
              ? 'Vous êtes sur le point de réactiver cet utilisateur. Il pourra à nouveau accéder à son compte et utiliser les services.'
              : 'Vous êtes sur le point de suspendre cet utilisateur. Il ne pourra plus accéder à son compte ni utiliser les services.'
          }
          type={isSuspended ? 'info' : 'warning'}
          showIcon
          icon={isSuspended ? <CheckCircleOutlined /> : <WarningOutlined />}
          style={{ marginBottom: 24 }}
        />

        <Form.Item
          name="reason"
          label="Raison"
          rules={[
            { required: true, message: 'Veuillez indiquer une raison' },
            { min: 10, message: 'La raison doit contenir au moins 10 caractères' },
          ]}
        >
          <TextArea
            rows={3}
            placeholder={
              isSuspended
                ? 'Expliquez pourquoi vous réactivez cet utilisateur...'
                : 'Expliquez pourquoi vous suspendez cet utilisateur...'
            }
          />
        </Form.Item>

        {!isSuspended && (
          <Form.Item
            name="endDate"
            label="Date de fin de suspension (optionnelle)"
            help="Laissez vide pour une suspension indéfinie"
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              disabledDate={(current) => current && current < dayjs().endOf('day')}
              placeholder="Sélectionner une date"
            />
          </Form.Item>
        )}

        <Form.Item
          name="notifyUser"
          valuePropName="checked"
        >
          <Checkbox>
            Notifier l'utilisateur par email
          </Checkbox>
        </Form.Item>
      </Form>

      <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
        <Text type="secondary">
          Utilisateur : <Text strong>{user.email}</Text>
        </Text>
        <Text type="secondary">
          Statut actuel : <Text strong>{isSuspended ? 'Suspendu' : 'Actif'}</Text>
        </Text>
      </Space>
    </Modal>
  );
}; 