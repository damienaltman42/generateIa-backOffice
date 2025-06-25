import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import './LoginPage.css';

const { Title, Text } = Typography;

export const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      const response = await authService.forgotPassword(values.email);
      message.success(response.message);
      setSubmitted(true);
    } catch {
      message.error('Erreur lors de l\'envoi de l\'email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="login-container">
        <Card className="login-card">
          <Result
            status="success"
            title="Email envoyé"
            subTitle="Si cet email existe dans notre système, vous recevrez un lien de réinitialisation."
            extra={[
              <Link to="/login" key="login">
                <Button type="primary">Retour à la connexion</Button>
              </Link>
            ]}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-logo">
          <img src="/images/sowat.webp" alt="Sowat Logo" />
        </div>
        
        <Title level={2} className="login-title">
          Mot de passe oublié
        </Title>
        
        <Text type="secondary" style={{ display: 'block', marginBottom: 24, textAlign: 'center' }}>
          Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </Text>
        
        <Form
          name="forgot-password"
          className="login-form"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Veuillez entrer votre email' },
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
              size="large"
              block
            >
              Envoyer le lien
            </Button>
          </Form.Item>

          <div className="login-links">
            <Link to="/login">
              <ArrowLeftOutlined /> Retour à la connexion
            </Link>
          </div>
        </Form>
        
        <div className="login-footer">
          <Text type="secondary">
            © 2025 Sowat - Tous droits réservés
          </Text>
        </div>
      </Card>
    </div>
  );
}; 