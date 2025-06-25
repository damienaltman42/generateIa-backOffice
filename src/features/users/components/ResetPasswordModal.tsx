import React from 'react';
import { Modal, Form, Input, Alert, Space, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import type { User, ResetPasswordData } from '../types/users.types';

const { Text } = Typography;
const { TextArea } = Input;

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSubmit: (data: ResetPasswordData) => void;
  loading?: boolean;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  open,
  onClose,
  user,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
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
      title="Réinitialiser le mot de passe"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Envoyer l'email"
      cancelText="Annuler"
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          customMessage: '',
        }}
      >
        <Alert
          message="Email de réinitialisation"
          description="Un email sera envoyé à l'utilisateur avec un lien pour réinitialiser son mot de passe. Le lien sera valide pendant 24 heures."
          type="info"
          showIcon
          icon={<MailOutlined />}
          style={{ marginBottom: 24 }}
        />

        <Form.Item
          name="customMessage"
          label="Message personnalisé (optionnel)"
          help="Ce message sera ajouté dans l'email de réinitialisation"
        >
          <TextArea
            rows={3}
            placeholder="Ex: Suite à votre demande, voici le lien pour réinitialiser votre mot de passe..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Alert
          message="Template d'email"
          description={
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">L'email contiendra :</Text>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                <li>Un message de salutation</li>
                <li>Les instructions pour réinitialiser le mot de passe</li>
                <li>Un lien sécurisé valable 24h</li>
                <li>Votre message personnalisé (si fourni)</li>
                <li>Les informations de contact du support</li>
              </ul>
            </div>
          }
          type="info"
          style={{ marginTop: 16 }}
        />
      </Form>

      <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LockOutlined style={{ color: '#666' }} />
          <Text type="secondary">
            Utilisateur : <Text strong>{user.email}</Text>
          </Text>
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Dernière connexion : {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('fr-FR') : 'Jamais'}
        </Text>
      </Space>
    </Modal>
  );
}; 