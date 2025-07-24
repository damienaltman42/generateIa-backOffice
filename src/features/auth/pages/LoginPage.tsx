import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import './LoginPage.css';

const { Title, Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthContext();
  const [loading, setLoading] = useState(false);

  // Rediriger si déjà connecté
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const result = await login(values.email, values.password);
      
      if (result.success) {
        message.success('Connexion réussie');
        // Ajouter un petit délai pour s'assurer que le token est bien stocké
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else {
        // Si l'utilisateur n'est pas admin, rediriger vers sowat.io
        if (result.error === 'NOT_ADMIN') {
          window.location.href = 'https://sowat.io';
        } else {
          message.error(result.error || 'Identifiants invalides');
        }
      }
    } catch {
      message.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-logo">
          <img src="/images/sowat.webp" alt="Sowat Logo" />
        </div>
        
        <Title level={2} className="login-title">
          Administration Sowat
        </Title>
        
        <Form
          name="login"
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
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mot de passe"
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
              Se connecter
            </Button>
          </Form.Item>

          <div className="login-links">
            <Link to="/forgot-password">
              Mot de passe oublié ?
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