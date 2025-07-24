import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Switch, Button, Card, Row, Col, Divider, Typography, Space } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { usePlanForm } from '../../hooks/usePlanForm';
import { FeatureEditor } from './FeatureEditor';
import { PriceCalculator } from './PriceCalculator';
import { PlanPreview } from './PlanPreview';
import type { Plan, PlanFormData, PlanFeatures } from '../../types/plans.types';

const { Title, Text } = Typography;

interface PlanFormProps {
  plan?: Plan;
  isEdit?: boolean;
}

export const PlanForm: React.FC<PlanFormProps> = ({ plan, isEdit = false }) => {
  const [form] = Form.useForm<PlanFormData>();
  const navigate = useNavigate();
  const { createPlan, updatePlan } = usePlanForm();
  const [isDirty, setIsDirty] = useState(false);

  // Initialiser le formulaire avec les données du plan
  useEffect(() => {
    if (plan) {
      // Convertir les features au bon format si nécessaire
      let formattedFeatures: PlanFeatures = { features: [] };
      if (plan.features) {
        if (plan.features.features && Array.isArray(plan.features.features)) {
          formattedFeatures = plan.features;
        } else if (Array.isArray(plan.features)) {
          formattedFeatures = { features: plan.features as any };
        }
      }

      form.setFieldsValue({
        name: plan.name,
        display_name: plan.display_name,
        articles_limit: plan.articles_limit,
        social_posts_limit: plan.social_posts_limit,
        stories_limit: plan.stories_limit,
        monthly_price: typeof plan.monthly_price === 'string' ? parseFloat(plan.monthly_price) : plan.monthly_price,
        yearly_price: typeof plan.yearly_price === 'string' ? parseFloat(plan.yearly_price) : plan.yearly_price,
        yearly_discount_percent: plan.yearly_discount_percent,
        trial_days: plan.trial_days,
        cumulation_max_percent: plan.cumulation_max_percent,
        extra_article_price: typeof plan.extra_article_price === 'string' ? parseFloat(plan.extra_article_price) : plan.extra_article_price,
        extra_social_post_price: typeof plan.extra_social_post_price === 'string' ? parseFloat(plan.extra_social_post_price) : plan.extra_social_post_price,
        extra_story_price: typeof plan.extra_story_price === 'string' ? parseFloat(plan.extra_story_price) : plan.extra_story_price,
        features: formattedFeatures,
        is_active: plan.is_active,
      });
    }
  }, [plan, form]);

  const handleSubmit = async (values: PlanFormData) => {
    console.log('🚀 Tentative de sauvegarde avec les valeurs:', values);
    
    try {
      if (isEdit && plan?.id) {
        console.log('📝 Mode édition, plan ID:', plan.id);
        await updatePlan.mutateAsync({ id: plan.id, data: values });
      } else {
        console.log('➕ Mode création');
        await createPlan.mutateAsync(values);
      }
      setIsDirty(false);
      console.log('✅ Sauvegarde réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?');
      if (!confirmed) return;
    }
    navigate('/plans');
  };

  const handleFormChange = () => {
    setIsDirty(true);
  };

  const isLoading = createPlan.isPending || updatePlan.isPending;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>
          {isEdit ? `Modifier le plan "${plan?.display_name}"` : 'Créer un nouveau plan'}
        </Title>
        <Space>
          <Button 
            icon={<CloseOutlined />} 
            onClick={handleCancel}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={() => form.submit()}
            loading={isLoading}
          >
            Sauvegarder
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleFormChange}
        initialValues={{
          articles_limit: 1,
          social_posts_limit: 10,
          stories_limit: 5,
          monthly_price: 0,
          yearly_price: 0,
          yearly_discount_percent: 0,
          trial_days: 0,
          cumulation_max_percent: 100,
          extra_article_price: 0,
          extra_social_post_price: 0,
          extra_story_price: 0,
          features: { features: [] },
          is_active: true,
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            {/* Informations générales */}
            <Card title="Informations générales" style={{ marginBottom: '24px' }}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Nom technique"
                    name="name"
                    rules={[
                      { required: true, message: 'Le nom technique est requis' },
                      { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Seuls les caractères alphanumériques, tirets et underscores sont autorisés' }
                    ]}
                  >
                    <Input placeholder="ex: pro" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Nom d'affichage"
                    name="display_name"
                    rules={[
                      { required: true, message: 'Le nom d\'affichage est requis' },
                      { min: 2, max: 50, message: 'Le nom doit contenir entre 2 et 50 caractères' }
                    ]}
                  >
                    <Input placeholder="ex: Pro" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Limites de contenu */}
            <Card title="Limites de contenu" style={{ marginBottom: '24px' }}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Articles"
                    name="articles_limit"
                    rules={[{ required: true, message: 'Limite d\'articles requise' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Posts sociaux"
                    name="social_posts_limit"
                    rules={[{ required: true, message: 'Limite de posts sociaux requise' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Stories"
                    name="stories_limit"
                    rules={[{ required: true, message: 'Limite de stories requise' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Tarification */}
            <PriceCalculator form={form} />

            {/* Configuration */}
            <Card title="Configuration" style={{ marginBottom: '24px' }}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Jours d'essai"
                    name="trial_days"
                  >
                    <InputNumber min={0} max={365} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Cumulation max (%)"
                    name="cumulation_max_percent"
                    rules={[{ required: true, message: 'Pourcentage de cumulation requis' }]}
                  >
                    <InputNumber min={0} max={1000} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Statut"
                    name="is_active"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="Actif" unCheckedChildren="Inactif" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider />
              
              <Text strong>Prix des extras</Text>
              <Row gutter={16} style={{ marginTop: '16px' }}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Article extra (€)"
                    name="extra_article_price"
                  >
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Post social extra (€)"
                    name="extra_social_post_price"
                  >
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Story extra (€)"
                    name="extra_story_price"
                  >
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Features */}
            <FeatureEditor form={form} />
          </Col>

          <Col xs={24} lg={8}>
            {/* Prévisualisation */}
            <PlanPreview form={form} />
          </Col>
        </Row>
      </Form>
    </div>
  );
}; 